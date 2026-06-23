import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { WS_URL } from '../api/config';

interface LiveNotification {
  notificationId: string;
  title: string;
  body: string;
  metadata?: any;
  timestamp: string;
}

export const useSocket = (token: string | null) => {
  const socketRef = useRef<Socket | null>(null);
  const [liveNotifications, setLiveNotifications] = useState<LiveNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    socketRef.current = io(WS_URL, { auth: { token } });

    socketRef.current.on('connect', () => {
      console.log('socket connected', socketRef.current?.id);
      setIsConnected(true);
    });
    socketRef.current.on('connect_error', (err) => {
      console.error('socket connect_error', err);
    });
    socketRef.current.on('disconnect', (reason) => {
      console.warn('socket disconnected', reason);
    });
    
    socketRef.current.on('notification', (data: LiveNotification) => {
      setLiveNotifications(prev => [data, ...prev].slice(0, 50));
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token]);

  const clearNotifications = () => setLiveNotifications([]);

  return { liveNotifications, isConnected, clearNotifications };
};
