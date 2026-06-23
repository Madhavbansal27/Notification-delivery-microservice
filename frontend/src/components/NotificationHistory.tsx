import React, { useEffect, useState } from 'react';
import { notificationApi } from '../api/notificationApi';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/formatDate';

export const NotificationHistory: React.FC = () => {
  const { userId } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await notificationApi.getByUser(userId, page, 20, statusFilter);
      setNotifications(res.data.notifications);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [userId, page, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return '#22c55e';
      case 'FAILED': return '#e53e3e';
      case 'PROCESSING': return '#f97316';
      case 'QUEUED': return '#999';
      default: return '#999';
    }
  };

  return (
    <div className="section-container">
      <div className="section-label">Notification History</div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-start">
          <div className="w-[150px]">
            <label>Filter Status</label>
            <select 
              value={statusFilter} 
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All</option>
              <option value="QUEUED">QUEUED</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
        </div>

        <div className="border border-[#e0e0e0] bg-white overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Channel</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Attempts</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8 text-[#999]">Loading...</td></tr>
              ) : notifications.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-[#999]">No notifications found</td></tr>
              ) : (
                notifications.map((n) => (
                  <tr key={n.id}>
                    <td className="text-[12px]">{n.title}</td>
                    <td className="text-[12px]">{n.type}</td>
                    <td className="text-[12px]">{n.channel}</td>
                    <td className="text-[12px]">{n.priority}</td>
                    <td className="text-[12px]">
                      <span className="status-dot" style={{ backgroundColor: getStatusColor(n.status) }}></span>
                      {n.status}
                    </td>
                    <td className="text-[12px]">{n.attempts}</td>
                    <td className="text-[12px]">{formatDate(n.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center gap-4 py-2">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="text-[13px] disabled:text-[#ccc] disabled:cursor-not-allowed border-none"
          >
            Previous
          </button>
          <span className="text-[12px] text-[#555]">Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="text-[13px] disabled:text-[#ccc] disabled:cursor-not-allowed border-none"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
