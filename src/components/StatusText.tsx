function getStatusText(status: string) {
  if (status === 'online') {
    return 'Online';
  } else if (status === 'away') {
    return 'Away';
  } else if (status === 'busy') {
    return 'Busy';
  } else if (status === 'invisible') {
    return 'Invisible';
  } else if (status === 'offline') {
    return 'Offline';
  }
}

export const StatusText = ({ status }) => {
  return <p className="text-gray-400 text-xs">{getStatusText(status)}</p>;
};
