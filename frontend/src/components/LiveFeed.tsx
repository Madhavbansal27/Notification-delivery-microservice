import React from 'react';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/formatDate';

export const LiveFeed: React.FC = () => {
  const { token } = useAuth();
  const { liveNotifications, isConnected, clearNotifications } = useSocket(token);

  return (
    <div className="flex flex-col bg-white border border-[#e0e0e0] h-full">
      <div className="p-3 border-b border-[#e0e0e0] flex justify-between items-center bg-[#fafafa]">
        <div className="flex items-center gap-2">
          <span className="status-dot" style={{ backgroundColor: isConnected ? '#22c55e' : '#999' }}></span>
          <span className="text-[12px] text-[#555]">
            {isConnected ? 'WebSocket connected' : 'WebSocket disconnected'}
          </span>
        </div>
        <button 
          onClick={clearNotifications}
          className="text-[11px] text-[#555] border-none bg-transparent p-0 hover:text-[#111]"
        >
          Clear
        </button>
      </div>
      <div className="overflow-y-auto max-h-[600px] flex-1">
        {liveNotifications.length === 0 ? (
          <div className="p-8 text-center text-[#999]">Waiting for notifications...</div>
        ) : (
          liveNotifications.map((n) => (
            <div key={n.notificationId} className="p-4 border-b border-[#e0e0e0] last:border-0">
              <div className="flex justify-between items-start mb-1">
                <div className="text-[13px] font-medium text-[#111]">{n.title}</div>
                <div className="text-[11px] text-[#999]">{formatDate(n.timestamp)}</div>
              </div>
              <div className="text-[12px] text-[#555]">{n.body}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
