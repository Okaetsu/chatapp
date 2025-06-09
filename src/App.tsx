import { useState, useRef } from 'react';
import { useAuth } from './hooks/AuthProvider';
import { StatusText } from './components/StatusText';
import { ChatWindow } from './components/ChatWindow';
import { FriendList } from './components/FriendList/FriendList';
import { ConversationFriendCard } from './components/ConversationFriendCard';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuSeparator
} from '@headlessui/react';
import { Cog8ToothIcon, UserIcon } from '@heroicons/react/20/solid';
import { Bars3Icon } from '@heroicons/react/20/solid';
import { SettingsPage } from './pages/Settings/Settings';
import { Avatar } from './components/Avatar';
import { ArrowLeft } from 'lucide-react';

export function App() {
  const { user } = useAuth();
  const [status, setStatus] = useState(user.status);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [activeWindowId, setActiveWindowId] = useState('friends');
  const [activeFriend, setActiveFriend] = useState<object | null>({});
  const [conversations, setConversations] = useState<object[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const sidebarRef = useRef<HTMLElement>(null);

  const requestStatusChange = (newStatus: string) => {
    if (status === newStatus) return;

    setStatus(newStatus);
    fetch(
      '/api/me/status?' + new URLSearchParams({ status: newStatus }).toString(),
      {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        }
      }
    );
  };

  const openConversation = (friend: object, channelId: string) => {
    setActiveChannelId(channelId);
    setActiveFriend(friend);
    openWindow('chat');

    if (
      conversations.filter(
        (conversation) => conversation.friend.username === friend.username
      ).length > 0
    ) {
      return;
    }

    const newConversations = conversations;
    newConversations.push({
      friend: friend,
      channelId: channelId
    });
    setConversations(newConversations);
  };

  const closeConversation = (channelId: string) => {
    if (
      conversations.filter(
        (conversation) => conversation.channelId === channelId
      ).length === 0
    ) {
      return;
    }

    setConversations([
      ...conversations.filter(
        (conversation) => conversation.channelId !== channelId
      )
    ]);

    if (activeChannelId === channelId) {
      setTimeout(() => {
        openWindow('friends');
      }, 1);
    }

    setActiveChannelId(null);
    setActiveFriend(null);
  };

  const openWindow = (windowId: string) => {
    setSidebarOpen(false);
    setActiveWindowId(windowId);
  };

  return (
    <main className="h-full max-w-full">
      <button
        className="md:hidden absolute top-2 left-4 w-8 h-8 z-30"
        onClick={() => setSidebarOpen(true)}
      >
        <ArrowLeft />
      </button>
      {settingsOpen && <SettingsPage onClose={() => setSettingsOpen(false)} />}
      <div className="flex h-full max-w-full">
        <div
          ref={sidebarRef}
          className={`absolute top-0 left-0 h-full w-full z-40 ${sidebarOpen ? 'flex' : 'hidden'} bg-gray-800 md:static md:w-auto md:flex flex-col items-center gap-16 min-h-0 min-w-xs`}
        >
          <div className="flex-1 w-full">
            <div className="flex p-2">
              <button
                className="text-gray-100 flex items-center p-2 gap-2 rounded-sm w-full hover:text-blue-700 focus:z-10 dark:hover:text-white dark:hover:bg-gray-700 cursor-pointer outline-0"
                onClick={() => openWindow('friends')}
              >
                <UserIcon className="w-7"></UserIcon>
                <span className="font-semibold">Friends</span>
              </button>
            </div>
            <MenuSeparator className="my-1 mx-4 h-px bg-gray-700" />
            <div className="flex flex-col gap-4 mt-4">
              {conversations.map((conversation) => {
                return (
                  <ConversationFriendCard
                    avatarUrl={conversation.friend.avatar}
                    displayName={conversation.friend.displayName}
                    status={conversation.friend.status}
                    onClick={() =>
                      openConversation(
                        conversation.friend,
                        conversation.channelId
                      )
                    }
                    onClose={() => closeConversation(conversation.channelId)}
                  />
                );
              })}
            </div>
          </div>
          <div className="flex w-full bg-black">
            <div className="p-1 flex-1">
              <Menu>
                <MenuButton className="flex items-center p-2 rounded-sm w-full hover:text-blue-700 focus:z-10 dark:hover:text-white dark:hover:bg-gray-700 cursor-pointer outline-0 transition-colors">
                  <Avatar
                    avatarUrl={user.avatar}
                    displayName={user.displayName}
                    status={status}
                    size={10}
                  />
                  <div className="flex flex-col items-start ml-3">
                    <p className="text-white text-sm">{user.username}</p>
                    <StatusText status={status} />
                  </div>
                </MenuButton>
                <MenuItems
                  anchor="top"
                  className="w-2xs origin-top-right rounded-xl border border-white/5 bg-gray-600 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(3)] focus:outline-none data-closed:scale-95 data-closed:opacity-0 z-50"
                >
                  <MenuItem>
                    <button
                      className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 hover:cursor-pointer"
                      onClick={() => {
                        requestStatusChange('online');
                      }}
                    >
                      <span className="bg-green-500 h-2 w-2 rounded-full"></span>
                      Online
                    </button>
                  </MenuItem>
                  <MenuSeparator className="my-0.5 h-px bg-gray-700" />
                  <MenuItem>
                    <button
                      className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 hover:cursor-pointer"
                      onClick={() => {
                        requestStatusChange('away');
                      }}
                    >
                      <span className="bg-yellow-500 h-2 w-2 rounded-full"></span>
                      Away
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 hover:cursor-pointer"
                      onClick={() => {
                        requestStatusChange('busy');
                      }}
                    >
                      <span className="bg-red-500 h-2 w-2 rounded-full"></span>
                      Busy
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10 hover:cursor-pointer"
                      onClick={() => {
                        requestStatusChange('invisible');
                      }}
                    >
                      <span className="bg-gray-500 h-2 w-2 rounded-full"></span>
                      Invisible
                    </button>
                  </MenuItem>
                  <MenuSeparator className="my-0.5 h-px bg-gray-700" />
                  <MenuItem>
                    <button
                      className="group flex w-full items-center gap-1 rounded-lg px-2 py-1.5 data-focus:bg-white/10 hover:cursor-pointer"
                      onClick={() => setSettingsOpen(true)}
                    >
                      <Cog8ToothIcon className="w-4"></Cog8ToothIcon>
                      Settings
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>
        {activeWindowId === 'friends' && (
          <FriendList
            onConversationOpened={(friend, channelId) => {
              openConversation(friend, channelId);
            }}
          />
        )}
        {activeWindowId === 'chat' && (
          <ChatWindow friend={activeFriend} channelId={activeChannelId} />
        )}
      </div>
    </main>
  );
}
