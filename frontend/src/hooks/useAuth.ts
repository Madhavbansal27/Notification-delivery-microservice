export const useAuth = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId') || '';
  const userName = localStorage.getItem('userName') || '';
  const userEmail = localStorage.getItem('userEmail') || '';

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return { token, userId, userName, userEmail, logout };
};
