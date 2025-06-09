import { MenuSeparator } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { Avatar } from '../Avatar';

enum FriendRequestAction {
  Accept = 'accept',
  Deny = 'deny',
  Cancel = 'cancel'
}

export const FriendRequest = ({
  avatarUrl,
  username,
  displayName,
  direction,
  onAction = (username: string, action: FriendRequestAction) => {}
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="w-full">
      <MenuSeparator className="h-px bg-gray-800" />
      <div
        className="w-full p-4 hover:bg-gray-700 hover:cursor-pointer rounded-sm transition-colors"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex flex-row items-center gap-3">
          <div className="flex items-center">
            <div className="flex relative">
              <Avatar
                avatarUrl={avatarUrl}
                displayName={displayName}
                size={10}
              />
            </div>
          </div>
          <p className="text-md text-left font-semibold flex-1">
            {displayName}
          </p>
          <div
            className={`flex gap-8 mr-4 ${hovered ? 'opacity-100' : 'opacity-0'}`}
          >
            {direction === 'incoming' && (
              <button
                className="p-2 rounded-sm bg-gray-600 text-gray-100 hover:text-green-400 hover:cursor-pointer"
                title="Accept"
                onClick={() => onAction(username, FriendRequestAction.Accept)}
              >
                <CheckIcon className="w-5 transition-colors" />
              </button>
            )}
            {direction === 'incoming' && (
              <button
                className="p-2 rounded-sm bg-gray-600 text-gray-100 hover:text-red-400 hover:cursor-pointer"
                title="Ignore"
                onClick={() => onAction(username, FriendRequestAction.Deny)}
              >
                <XMarkIcon className="w-5 transition-colors" />
              </button>
            )}
            {direction === 'outgoing' && (
              <button
                className="p-2 rounded-sm bg-gray-600 text-gray-100 hover:text-red-400 hover:cursor-pointer"
                title="Cancel"
                onClick={() => onAction(username, FriendRequestAction.Cancel)}
              >
                <XMarkIcon className="w-5 transition-colors" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
