import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const TopBar: React.FC = () => {
  const { userEmail, logout } = useAuth();

  return (
    <div className="h-[44px] border-b border-[#e0e0e0] bg-white px-6 flex items-center justify-between">
      <div className="text-[14px] font-semibold text-[#111]">Notification Engine</div>
      <div className="flex items-center gap-4">
        <span className="text-[13px] text-[#555]">{userEmail}</span>
        <button 
          onClick={logout}
          className="text-[13px] text-[#555] border-none bg-transparent p-0 hover:bg-transparent hover:text-[#111] cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
