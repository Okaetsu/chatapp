import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../hooks/SocketProvider';
import { useAuth } from '../hooks/AuthProvider';
import { Message } from './Message';
import type { MessageType } from './Message';
import { PaperAirplaneIcon } from '@heroicons/react/20/solid';
import { Avatar } from './Avatar';

export const ChatWindow = ({ friend, channelId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const { socket } = useSocket();
  const windowRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleIncomingWebsocketMessage(message) {
      const { messageType, data } = JSON.parse(message.data);

      switch (messageType) {
        case 0:
          onMessageReceived(data);
          break;
        case 5:
          onMessageDeleted(data);
          break;
      }
    }

    function onMessageReceived(message) {
      setMessages((messages) => [...messages, message]);
    }

    function onMessageDeleted(messageInfo) {
      setMessages((messages) => [
        ...messages.filter((message) => message.id !== messageInfo.id)
      ]);
    }

    socket.addEventListener('message', handleIncomingWebsocketMessage);

    fetch(`/api/me/channels/${channelId}/messages`, {})
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text());
        }

        const resData = await res.json();
        setMessages((messages) => [...messages, ...resData.messages]);
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      socket.removeEventListener('message', handleIncomingWebsocketMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (windowRef) {
      setTimeout(() => {
        windowRef.current!.scrollIntoView();
      }, 1);
    }
  }, [messages]);

  function onSubmit() {
    const element = inputRef;
    const message = element.current!.value;
    element.current!.value = '';
    if (message !== '') {
      fetch(`/api/me/channels/${channelId}/messages`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: message
        })
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(await res.text());
          }

          const resData = await res.json();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  function deleteMessage(id: string) {
    fetch(`/api/me/channels/${channelId}/messages`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messageId: id
      })
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text());
        }

        setMessages([...messages.filter((message) => message.id !== id)]);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function onTextChanged(e) {
    const element = e.currentTarget as HTMLInputElement;
    const message = element.value;
    if (message.length > 0) {
      sendButtonRef.current!.classList.add('flex');
      sendButtonRef.current!.classList.remove('hidden');
    } else {
      sendButtonRef.current!.classList.add('hidden');
      sendButtonRef.current!.classList.remove('flex');
    }
  }

  return (
    <div className="bg-gray-900 relative flex flex-col items-center flex-1 w-full overflow-hidden">
      <div className="flex w-full p-2 bg-gray-800 border-b-gray-700 border-b-1 fixed md:absolute z-10">
        <div className="flex w-full justify-center items-center gap-2">
          <Avatar
            avatarUrl={friend.avatar}
            displayName={friend.displayName}
            size={8}
          />
          <p className="text-md text-left font-semibold">
            {friend.displayName}
          </p>
        </div>
      </div>
      <div
        id="messagesList"
        className="flex flex-1 flex-col pl-4 pr-4 pt-4 mt-8 md:mt-8 gap-2 w-full overflow-x-clip overflow-y-scroll text-wrap break-all"
      >
        {messages.map((message: MessageType) => {
          console.log(message);
          return (
            <Message
              id={message.id}
              avatarUrl={message.user.avatar}
              sender={message.user.displayName}
              content={message.content}
              timestamp={message.timestamp}
              isSelf={user.username === message.user.username}
              onDelete={(id) => deleteMessage(id)}
            />
          );
        })}
        <div ref={windowRef}></div>
      </div>
      <div className="flex flex-col gap-16 w-full p-2">
        <div className="flex items-center gap-2 w-full bg-gray-800 rounded-sm border-2 border-gray-700">
          <textarea
            ref={inputRef}
            className="w-full h-12 md:h-auto max-h-100 p-3 field-sizing-content outline-0 resize-none"
            autoComplete="nope"
            placeholder={`Message @${friend.username}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.shiftKey === false) {
                e.preventDefault();
                onSubmit();
              }
            }}
            onChange={onTextChanged}
          />
          <button
            ref={sendButtonRef}
            className={`md:hidden hidden justify-center items-center hover:cursor-pointer bg-cyan-400 w-10 h-8 mr-2 rounded-sm`}
            onClick={onSubmit}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
