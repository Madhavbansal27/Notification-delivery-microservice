import React, { useEffect, useState } from 'react';
import { userApi } from '../api/notificationApi';
import { useAuth } from '../hooks/useAuth';

export const UserPreferences: React.FC = () => {
  const { userId } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState({
    emailEnabled: true,
    inappEnabled: true,
    pushEnabled: true,
    quietHourStart: null as number | null,
    quietHourEnd: null as number | null
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const res = await userApi.getPreferences(userId);
        if (res.data.preferences) {
          setPrefs(res.data.preferences);
        }
      } catch (err) {
        console.error('Failed to fetch preferences');
      }
    };
    if (userId) fetchPrefs();
  }, [userId]);

  const handleSave = async () => {
    try {
      await userApi.updatePreferences(userId, prefs);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save preferences');
    }
  };

  return (
    <div className="section-container border-b-0">
      <div className="flex justify-between items-center mb-4">
        <div className="section-label mb-0">User Preferences</div>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-[12px] text-[#555] border-none p-0"
        >
          {expanded ? 'Hide' : 'Show'}
        </button>
      </div>

      {expanded && (
        <div className="flex flex-col gap-6 bg-white border border-[#e0e0e0] p-6">
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4"
                checked={prefs.emailEnabled}
                onChange={e => setPrefs({...prefs, emailEnabled: e.target.checked})}
              />
              <span>Email notifications</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4"
                checked={prefs.inappEnabled}
                onChange={e => setPrefs({...prefs, inappEnabled: e.target.checked})}
              />
              <span>In-app notifications</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4"
                checked={prefs.pushEnabled}
                onChange={e => setPrefs({...prefs, pushEnabled: e.target.checked})}
              />
              <span>Push notifications</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-[400px]">
            <div>
              <label>Quiet hours start (0-23)</label>
              <input 
                type="number" 
                placeholder="e.g. 23"
                value={prefs.quietHourStart ?? ''}
                onChange={e => setPrefs({...prefs, quietHourStart: e.target.value ? parseInt(e.target.value) : null})}
              />
            </div>
            <div>
              <label>Quiet hours end (0-23)</label>
              <input 
                type="number" 
                placeholder="e.g. 8"
                value={prefs.quietHourEnd ?? ''}
                onChange={e => setPrefs({...prefs, quietHourEnd: e.target.value ? parseInt(e.target.value) : null})}
              />
            </div>
            <div className="col-span-2 text-[11px] text-[#999]">Leave blank to disable quiet hours</div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleSave} className="primary">Save Preferences</button>
            {saved && <span className="text-[13px] text-[#22c55e]">Saved.</span>}
          </div>
        </div>
      )}
    </div>
  );
};
