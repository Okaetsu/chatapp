import { Avatar } from './Avatar';
import { Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

function getTimestampAsLocalTimeString(timestamp: number) {
  const date = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  return date;
}

function getTimestampAsLocalDateString(timestamp: number) {
  const date = new Date(timestamp).toLocaleString();
  return date;
}

export interface MessageType {
  username: string;
  displayName: string;
  avatar: string;
  content: string;
  timestamp: number;
}

const imageRegex = /(https?:\/\/\S+\.(?:png|jpe?g|gif|webp))/gi;

export const Message = ({
  id,
  avatarUrl,
  sender = '',
  content = '',
  timestamp = 0,
  isSelf = false,
  onDelete = (id: string) => {}
}) => {
  const embeds = [];

  [...content.matchAll(imageRegex)].forEach((m) => {
    embeds.push(`<img src="${m[1]}" />`);
  });

  content = content.replace(imageRegex, '');

  return (
    <div className="flex flex-row gap-3 p-2 rounded-sm hover:bg-gray-800 group">
      <div className="flex items-start">
        <Avatar avatarUrl={avatarUrl} displayName={sender} size={10} />
      </div>
      <div className="flex flex-col w-full mt-sm">
        <div className="flex w-full gap-2 items-center">
          <p className="hover:underline hover:cursor-pointer">{sender}</p>
          <div className="flex-1">
            <p
              className="w-fit text-gray-500 text-xs hover:cursor-default"
              title={getTimestampAsLocalDateString(timestamp)}
            >
              {getTimestampAsLocalTimeString(timestamp)}
            </p>
          </div>
          <div className="hidden group-hover:flex">
            {isSelf && (
              <button
                title="Delete"
                className="text-rose-400 hover:text-rose-500 hover:cursor-pointer"
                onClick={() => onDelete(id)}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <div style={{ whiteSpace: 'pre-line' }}>
          <ReactMarkdown skipHtml={true}>{content}</ReactMarkdown>
          {embeds.map((embed) => {
            return <div dangerouslySetInnerHTML={{ __html: embed }}></div>;
          })}
        </div>
      </div>
    </div>
  );
};
