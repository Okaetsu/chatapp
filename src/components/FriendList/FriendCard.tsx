import { StatusIndicator } from '../StatusIndicator';
import { MenuSeparator } from '@headlessui/react';
import { ChatBubbleBottomCenterIcon } from '@heroicons/react/20/solid';
import { Avatar } from '../Avatar';

export const FriendCard = ({
  avatarUrl,
  displayName,
  status,
  onClick = () => {}
}) => {
  return (
    <div className="w-full px-4">
      <MenuSeparator className="h-px bg-gray-800" />
      <button
        className="w-full p-4 hover:bg-gray-700 hover:cursor-pointer rounded-sm transition-colors"
        onClick={onClick}
      >
        <div className="flex flex-row items-center gap-3">
          <div className="flex items-center">
            <div className="flex relative">
              <Avatar
                avatarUrl={avatarUrl}
                displayName={displayName}
                status={status}
                size={10}
              />
            </div>
          </div>
          <p className="text-md text-left font-semibold flex-1">
            {displayName}
          </p>
          {status !== undefined && (
            <div className="flex gap-5 mr-2">
              <ChatBubbleBottomCenterIcon className="w-5 text-gray-100" />
            </div>
          )}
        </div>
      </button>
    </div>
  );
};
