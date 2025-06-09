import { useContext, createContext, useState, useEffect } from 'react';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('/ws');

    ws.addEventListener('open', function () {
      setSocket(ws);
    });

    ws.addEventListener('close', function () {
      setSocket(null);
    });

    ws.addEventListener('error', function () {
      setSocket(null);
    });
  }, []);

  const sendMessage = (message: string) => {
    if (socket) {
      socket.send(message);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;

export const useSocket = () => {
  return useContext(SocketContext);
};
