// client/src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async ({ email, password, latitude, longitude, confirmOutside }) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        latitude,
        longitude,
        confirmOutside,
      });
      localStorage.setItem('token', res.data.token);
      setUser({
        id: res.data.user.id,
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role,
        employeeId: res.data.user.employeeId,
      });
      console.log('User set after login:', res.data.user);
      return res.data;
    } catch (error) {
      console.error('Login error:', error.response?.data);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/auth/logout',
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) { // Only fetch if no user is set
      axios
        .get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser({
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            role: res.data.role,
            employeeId: res.data.employeeId,
          });
        })
        .catch((error) => {
          console.error('Fetch /me error:', error.response?.data);
          if (error.response?.status === 404) {
            console.error('User not found for token.');
            localStorage.removeItem('token');
            setUser(null);
            navigate('/login');
          }
        });
    }
  }, [navigate, user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;