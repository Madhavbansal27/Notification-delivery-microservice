import React, { useEffect, useState } from 'react';
import { statsApi } from '../api/notificationApi';

interface QueueData {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}

interface StatsResponse {
  critical: QueueData;
  high: QueueData;
  low: QueueData;
  onlineUsers: number;
}

export const QueueStats: React.FC = () => {
  const [stats, setStats] = useState<StatsResponse | null>(null);

  const fetchStats = async () => {
    try {
      const res = await statsApi.getQueues();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch queue stats');
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return <div className="text-[#999]">Loading stats...</div>;

  const QueueBox = ({ name, data, dotColor }: { name: string, data: QueueData, dotColor: string }) => (
    <div className="flex-1 border border-[#e0e0e0] p-4 bg-white">
      <div className="flex items-center mb-4">
        <span className="status-dot" style={{ backgroundColor: dotColor }}></span>
        <span className="text-[12px] uppercase text-[#999] font-medium">{name}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-[15px] text-[#111]">{data.waiting}</div>
          <div className="text-[11px] text-[#999]">WAITING</div>
        </div>
        <div>
          <div className="text-[15px] text-[#111]">{data.active}</div>
          <div className="text-[11px] text-[#999]">ACTIVE</div>
        </div>
        <div>
          <div className="text-[15px] text-[#111]">{data.completed}</div>
          <div className="text-[11px] text-[#999]">COMPLETED</div>
        </div>
        <div>
          <div className="text-[15px] text-[#111]">{data.failed}</div>
          <div className="text-[11px] text-[#999]">FAILED</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="section-container">
      <div className="section-label">Queue Stats</div>
      <div className="flex gap-4">
        <QueueBox name="Critical" data={stats.critical} dotColor="#ef4444" />
        <QueueBox name="High" data={stats.high} dotColor="#f97316" />
        <QueueBox name="Low" data={stats.low} dotColor="#999" />
        <div className="w-[200px] border border-[#e0e0e0] p-4 bg-white flex flex-col justify-center items-center">
          <div className="text-[12px] uppercase text-[#999] mb-1">Online Users</div>
          <div className="text-[24px] font-semibold text-[#111]">{stats.onlineUsers}</div>
        </div>
      </div>
    </div>
  );
};
