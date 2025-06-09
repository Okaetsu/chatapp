import { useEffect, useState, useRef } from 'react';
import { FriendCard } from './FriendCard';
import { FriendRequest } from './FriendRequest';
import { useAuth } from '../../hooks/AuthProvider';
import { useSocket } from '../../hooks/SocketProvider';
import { Modal } from '../Modal';

enum FriendRequestAction {
  Accept = 'accept',
  Deny = 'deny'
}

export const FriendList = ({
  onConversationOpened = (user: object, channelId: string) => {}
}) => {
  const [friends, setFriends] = useState<object[]>([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [category, setCategory] = useState<string>('friends');
  const [modalData, setModalData] = useState({
    open: false,
    title: 'Title',
    content: 'Content',
    confirmButtonText: 'Close'
  });

  const friendsRef = useRef(friends);

  const { user } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    friendsRef.current = friends;
  }, [friends]);

  useEffect(() => {
    if (!socket) return;

    fetch('/api/me/friends', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text());
        }

        const responseData = await res.json();
        if (!responseData) {
          throw new Error(await res.text());
        }

        setFriends(responseData.friends);
      })
      .catch((err) => {
        console.error(err);
      });

    fetch('/api/me/friends/request', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text());
        }

        const responseData = await res.json();
        if (!responseData) {
          throw new Error(await res.text());
        }

        setFriendRequests(responseData.requests.incoming);
        setPendingRequests(responseData.requests.outgoing);
      })
      .catch((err) => {
        console.error(err);
      });

    const handleIncomingWebsocketMessage = (message) => {
      const { messageType, data } = JSON.parse(message.data);

      switch (messageType) {
        case 1:
          handleStatusUpdate(data);
          break;
        case 4:
          handleUserUpdate(data);
          break;
      }
    };

    const handleStatusUpdate = (data: object) => {
      const currentFriends = friendsRef.current;

      const updatedFriends = currentFriends.map((friend) => {
        if (friend.username === data.username) {
          return {
            ...friend,
            status: data.status
          };
        }
        return friend;
      });

      setFriends(updatedFriends);
    };

    const handleUserUpdate = (data: object) => {
      const currentFriends = friendsRef.current;

      const updatedFriends = currentFriends.map((friend) => {
        if (friend.username === data.user.username) {
          return {
            ...friend,
            displayName: data.user.displayName,
            ...(data.user.avatar !== null && { avatar: data.user.avatar })
          };
        }
        return friend;
      });

      console.log('Friends updated.');

      setFriends(updatedFriends);
    };

    socket.addEventListener('message', handleIncomingWebsocketMessage);

    return () => {
      socket.removeEventListener('message', handleIncomingWebsocketMessage);
    };
  }, [socket]);

  const addFriend = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const friendUsername = formData.get('friendUsername');

    if (friendUsername === '') return;

    fetch(
      '/api/me/friends/request?' +
        new URLSearchParams({ friendUsername: friendUsername }).toString(),
      {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        }
      }
    )
      .then(async (res) => {
        if (!res.ok) {
          const responseError = await res.json();
          throw new Error(responseError.error);
        }

        const responseData = await res.json();
        if (!responseData) {
          throw new Error(await res.text());
        }

        setPendingRequests([...pendingRequests, responseData.friend]);
      })
      .catch((err) => {
        console.error(err);
        setModalData({
          title: 'Friend Request Failed',
          content: err.message,
          open: true
        });
      });

    e.target.reset();
  };

  const onFriendRequestAction = (
    username: string,
    action: FriendRequestAction
  ) => {
    if (action !== 'cancel') {
      fetch(
        '/api/me/friends/request?' +
          new URLSearchParams({
            friendUsername: username,
            action: action
          }).toString(),
        {
          method: 'put',
          headers: {
            'content-type': 'application/json'
          }
        }
      )
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(await res.text());
          }

          const responseData = await res.json();
          if (responseData) {
            const { username, displayName, status } = responseData.friend;

            const newFriendRequests = friendRequests.filter(
              (friend) => friend.username !== username
            );
            setFriendRequests(newFriendRequests);

            const newFriends = friends;
            newFriends.push({
              username: username,
              displayName: displayName,
              status: status
            });

            setFriends(newFriends);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      fetch(
        '/api/me/friends/request?' +
          new URLSearchParams({ friendUsername: username }).toString(),
        {
          method: 'delete',
          headers: {
            'content-type': 'application/json'
          }
        }
      )
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(await res.text());
          }

          const newPendingRequests = pendingRequests.filter(
            (friend) => friend.username !== username
          );
          setPendingRequests(newPendingRequests);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const openConversation = (friend: object) => {
    fetch(
      '/api/me/channels?' +
        new URLSearchParams({
          channelType: 0,
          username: friend.username
        }).toString(),
      {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        }
      }
    )
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text());
        }

        const resData = await res.json();
        onConversationOpened(friend, resData.channelId);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="bg-gray-900 flex flex-col min-h-0 flex-1 max-w-full">
      <div className="flex flex-col md:flex-row items-center m-4">
        <div className="flex flex-1 flex-col md:flex-row">
          <button
            className={`py-2 px-3 rounded-sm font-semibold ${category === 'friends' ? 'bg-gray-800' : ''} hover:bg-gray-700 hover:cursor-pointer transition-colors`}
            onClick={() => setCategory('friends')}
          >
            All Friends ({friends.length})
          </button>

          <button
            className={`py-2 px-3 rounded-sm font-semibold ${category === 'pendingRequests' ? 'bg-gray-800' : ''} hover:bg-gray-700 hover:cursor-pointer transition-colors`}
            onClick={() => setCategory('pendingRequests')}
          >
            Pending ({pendingRequests.length})
          </button>

          <button
            className={`py-2 px-3 rounded-sm font-semibold ${category === 'incomingRequests' ? 'bg-gray-800' : ''} hover:bg-gray-700 hover:cursor-pointer transition-colors`}
            onClick={() => setCategory('incomingRequests')}
          >
            Friend Requests ({friendRequests.length})
          </button>
        </div>
        <button
          className="font-semibold bg-indigo-500 rounded-sm py-1 px-2 hover:bg-indigo-600 hover:cursor-pointer transition-colors"
          onClick={() => setCategory('addFriend')}
        >
          Add Friend
        </button>
      </div>
      {category === 'friends' &&
        friends.map((friend) => {
          return (
            <FriendCard
              avatarUrl={friend.avatar}
              displayName={friend.displayName}
              status={friend.status}
              onClick={() => openConversation(friend)}
            />
          );
        })}
      {category === 'incomingRequests' && (
        <div className="px-4">
          {friendRequests.map((friendRequest) => {
            return (
              <FriendRequest
                avatarUrl={friendRequest.avatar}
                username={friendRequest.username}
                displayName={friendRequest.displayName}
                direction="incoming"
                onAction={onFriendRequestAction}
              />
            );
          })}
        </div>
      )}
      {category === 'pendingRequests' && (
        <div className="px-4">
          {pendingRequests.map((friendRequest) => {
            return (
              <FriendRequest
                avatarUrl={friendRequest.avatar}
                username={friendRequest.username}
                displayName={friendRequest.displayName}
                direction="outgoing"
                onAction={onFriendRequestAction}
              />
            );
          })}
        </div>
      )}
      {category === 'addFriend' && (
        <div className="flex flex-col gap-2 px-7.5">
          <Modal
            open={modalData.open}
            title={modalData.title}
            content={modalData.content}
            confirmButtonText={modalData.confirmButtonText}
            onClose={() => setModalData({ open: false })}
          ></Modal>
          <h1 className="font-semibold text-lg">Add Friend</h1>
          <form className="flex flex-col gap-2" onSubmit={addFriend}>
            <input
              type="text"
              name="friendUsername"
              className="outline-0 w-full flex-2/4 flex items-center gap-2 max-w-240 bg-gray-800 p-2 rounded-sm border-2 border-gray-700"
              placeholder="Enter a username"
            />
            <button
              type="submit"
              className="bg-indigo-500 rounded-sm p-2 max-h-12 max-w-50 font-semibold flex-2/4 hover:bg-indigo-600 hover:cursor-pointer"
            >
              Send Friend Request
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
