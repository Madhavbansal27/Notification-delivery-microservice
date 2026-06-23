import React, { useState } from 'react';
import { notificationApi } from '../api/notificationApi';
import { useAuth } from '../hooks/useAuth';

export const NotificationTester: React.FC = () => {
  const { userId } = useAuth();
  const [formData, setFormData] = useState({
    userId: userId,
    type: 'OTP',
    channel: 'INAPP',
    priority: 'HIGH',
    title: '',
    body: ''
  });
  const [response, setResponse] = useState<any>(null);
  const [lastSent, setLastSent] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await notificationApi.send(formData);
      setResponse(res.data);
      setLastSent(prev => [{
        ...formData,
        id: res.data.notificationId,
        time: new Date().toISOString()
      }, ...prev].slice(0, 5));
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError(`Rate limited. Retry after ${err.response.data.retryAfter} seconds`);
      } else {
        setError(err.response?.data?.error || 'Failed to send notification');
      }
      setResponse(err.response?.data || { error: 'Unknown error' });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white border border-[#e0e0e0] p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>User ID</label>
            <input 
              type="text" 
              value={formData.userId} 
              onChange={e => setFormData({...formData, userId: e.target.value})}
            />
          </div>
          <div>
            <label>Type</label>
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option value="OTP">OTP</option>
              <option value="ORDER_UPDATE">ORDER_UPDATE</option>
              <option value="PROMO">PROMO</option>
              <option value="SYSTEM_ALERT">SYSTEM_ALERT</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Channel</label>
            <select value={formData.channel} onChange={e => setFormData({...formData, channel: e.target.value})}>
              <option value="INAPP">INAPP</option>
              <option value="EMAIL">EMAIL</option>
              <option value="PUSH">PUSH</option>
            </select>
          </div>
          <div>
            <label>Priority</label>
            <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
        </div>
        <div>
          <label>Title</label>
          <input 
            type="text" 
            placeholder="Notification title"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>
        <div>
          <label>Body</label>
          <textarea 
            rows={3} 
            placeholder="Notification body"
            value={formData.body}
            onChange={e => setFormData({...formData, body: e.target.value})}
            required
          />
        </div>
        <button type="submit" className="primary w-full">Send Notification</button>
      </form>

      {error && <div className="text-[#e53e3e] text-[12px]">{error}</div>}

      {response && (
        <div className="bg-[#f5f5f5] border border-[#e0e0e0] p-3">
          <div className="text-[11px] text-[#999] mb-2 uppercase font-medium">Response</div>
          <pre className="text-[12px] font-mono whitespace-pre-wrap overflow-x-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      <div>
        <div className="text-[12px] text-[#999] mb-2 uppercase font-medium">Last 5 Sent</div>
        <div className="flex flex-col border border-[#e0e0e0] bg-white">
          {lastSent.length === 0 ? (
            <div className="p-4 text-[#999] text-center">No notifications sent yet</div>
          ) : (
            lastSent.map((item, i) => (
              <div key={i} className="p-3 border-b border-[#e0e0e0] last:border-0">
                <div className="flex justify-between items-start">
                  <div className="text-[13px] text-[#111]">{item.title}</div>
                  <div className="text-[11px] text-[#999]">{new Date(item.time).toLocaleTimeString()}</div>
                </div>
                <div className="text-[11px] text-[#555] mt-1">
                  {item.priority} • {item.channel} • ID: {item.id}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
