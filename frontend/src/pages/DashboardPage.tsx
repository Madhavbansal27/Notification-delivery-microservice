import React from 'react';
import { TopBar } from '../components/TopBar';
import { QueueStats } from '../components/QueueStats';
import { DeliveryStats } from '../components/DeliveryStats';
import { FailedNotifications } from '../components/FailedNotifications';
import { NotificationTester } from '../components/NotificationTester';
import { LiveFeed } from '../components/LiveFeed';
import { NotificationHistory } from '../components/NotificationHistory';
import { UserPreferences } from '../components/UserPreferences';

export const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <TopBar />
      <main className="p-6 max-w-[1400px] mx-auto">
        
        <QueueStats />

        <div className="section-container">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="section-label">Delivery Stats</div>
              <DeliveryStats />
            </div>
            <div>
              <div className="section-label">Failed Notifications</div>
              <FailedNotifications />
            </div>
          </div>
        </div>

        <div className="section-container">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="section-label">Notification Tester</div>
              <NotificationTester />
            </div>
            <div className="flex flex-col">
              <div className="section-label">Live Feed</div>
              <LiveFeed />
            </div>
          </div>
        </div>

        <NotificationHistory />
        
        <UserPreferences />

      </main>
    </div>
  );
};
