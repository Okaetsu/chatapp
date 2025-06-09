import { StatusIndicator } from './StatusIndicator';

export const Avatar = ({
  avatarUrl,
  displayName = 'Undefined',
  status,
  size = 10
}) => {
  return (
    <div
      style={{ width: `${0.25 * size}rem` }}
      className={`relative flex h-${size} items-center rounded-full${avatarUrl ? '' : ' bg-gray-500'}`}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          className={`w-${size} h-${size} rounded-full`}
        ></img>
      ) : (
        <p className={`w-${size} text-center text-xl select-none`}>
          {displayName[0]}
        </p>
      )}
      {status && <StatusIndicator status={status} />}
    </div>
  );
};
