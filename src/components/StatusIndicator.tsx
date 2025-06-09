function getStatusColor(status: string) {
  if (status === 'online') {
    return 'bg-green-500';
  } else if (status === 'away') {
    return 'bg-yellow-500';
  } else if (status === 'busy') {
    return 'bg-red-500';
  } else if (status === 'invisible') {
    return 'bg-gray-500';
  } else if (status === 'offline') {
    return 'bg-gray-500';
  }
}

export const StatusIndicator = ({ status }) => {
  return (
    <div
      className={`${getStatusColor(status)} h-3.5 w-3.5 rounded-full absolute bottom-px right-px border-2 border-gray-900 transition-colors transition duration-300`}
    ></div>
  );
};
