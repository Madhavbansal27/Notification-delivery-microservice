import React, { useEffect, useState } from 'react';
import { statsApi } from '../api/notificationApi';
import { formatDate } from '../utils/formatDate';

export const FailedNotifications: React.FC = () => {
  const [failed, setFailed] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    try {
      const res = await statsApi.getFailed();
      setFailed(res.data.failed || []);
      setTotal(res.data.failed?.length || 0);
    } catch (err) {
      console.error('Failed to fetch failed notifications');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="text-[12px] text-[#999] mb-2">Showing {failed.slice(0, 10).length} of {total} failed</div>
      <div className="overflow-x-auto border border-[#e0e0e0] bg-white">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Title</th>
              <th>Type</th>
              <th>Channel</th>
              <th>Priority</th>
              <th>Attempts</th>
              <th>Failed At</th>
            </tr>
          </thead>
          <tbody>
            {failed.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-[#999]">No failed notifications</td>
              </tr>
            ) : (
              failed.slice(0, 10).map((item) => (
                <tr key={item.id}>
                  <td className="text-[12px]">{item.user?.email}</td>
                  <td className="text-[12px]">{item.title}</td>
                  <td className="text-[12px]">{item.type}</td>
                  <td className="text-[12px]">{item.channel}</td>
                  <td className="text-[12px]">{item.priority}</td>
                  <td className="text-[12px]">{item.attempts}</td>
                  <td className="text-[12px]">{formatDate(item.failedAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
