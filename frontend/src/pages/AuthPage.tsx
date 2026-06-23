import React, { useState } from 'react';
import { authApi } from '../api/notificationApi';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = isLogin 
        ? await authApi.login({ email: formData.email, password: formData.password })
        : await authApi.register(formData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('userName', res.data.user.name);
      localStorage.setItem('userEmail', res.data.user.email);
      
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="w-full max-w-[360px] p-8 bg-white border border-[#e0e0e0]">
        <div className="flex gap-4 mb-8 border-b border-[#e0e0e0]">
          <button 
            onClick={() => setIsLogin(true)}
            className={`pb-2 px-0 border-none bg-transparent text-[14px] ${isLogin ? 'text-[#111] font-semibold border-b-2 border-[#111]' : 'text-[#999]'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`pb-2 px-0 border-none bg-transparent text-[14px] ${!isLogin ? 'text-[#111] font-semibold border-b-2 border-[#111]' : 'text-[#999]'}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label>Name</label>
              <input 
                type="text" 
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          <div>
            <label>Email</label>
            <input 
              type="email" 
              required 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label>Password</label>
            <input 
              type="password" 
              required 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          {error && <div className="text-[12px] text-[#e53e3e] mt-1">{error}</div>}
          
          <button type="submit" disabled={loading} className="primary mt-4">
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};
