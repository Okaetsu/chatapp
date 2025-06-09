import { StatusIndicator } from './StatusIndicator';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { Avatar } from './Avatar';

export const ConversationFriendCard = ({
  avatarUrl,
  displayName,
  status = 'online',
  onClick = () => {},
  onClose = () => {}
}) => {
  return (
    <div className="w-full px-4">
      <div
        className="w-full p-2 hover:bg-gray-700 hover:cursor-pointer rounded-sm transition-colors"
        onClick={onClick}
      >
        <div className="flex flex-row items-center gap-3">
          <div className="flex items-center">
            <Avatar
              avatarUrl={avatarUrl}
              displayName={displayName}
              status={status}
              size={10}
            />
          </div>
          <p className="text-md text-left font-semibold flex-1">
            {displayName}
          </p>
          <button onClick={onClose}>
            <XMarkIcon className="w-5 text-gray-100 hover:cursor-pointer hover:text-gray-300 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};
