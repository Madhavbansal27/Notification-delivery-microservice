import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { statsApi } from '../api/notificationApi';

interface DeliveryData {
  delivered: number;
  failed: number;
  pending: number;
  successRate: string;
}

export const DeliveryStats: React.FC = () => {
  const [data, setData] = useState<DeliveryData | null>(null);

  const fetchData = async () => {
    try {
      const res = await statsApi.getDelivery();
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch delivery stats');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="text-[#999]">Loading delivery stats...</div>;

  const chartData = [
    { name: 'Delivered', value: data.delivered, color: '#111' },
    { name: 'Failed', value: data.failed, color: '#e53e3e' },
    { name: 'Pending', value: data.pending, color: '#ccc' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-8">
        <div>
          <div className="text-[15px] text-[#111]">{data.delivered}</div>
          <div className="text-[11px] text-[#999]">DELIVERED</div>
        </div>
        <div>
          <div className="text-[15px] text-[#111]">{data.failed}</div>
          <div className="text-[11px] text-[#999]">FAILED</div>
        </div>
        <div>
          <div className="text-[15px] text-[#111]">{data.pending}</div>
          <div className="text-[11px] text-[#999]">PENDING</div>
        </div>
      </div>
      
      <div className="text-[13px] text-[#555]">Success rate: <span className="font-semibold">{data.successRate}</span></div>

      <div className="flex items-center gap-8">
        <div className="w-[200px] h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-2">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span className="status-dot" style={{ backgroundColor: item.color }}></span>
              <span className="text-[12px] text-[#555]">{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
