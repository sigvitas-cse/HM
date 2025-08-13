// client/src/pages/Login.jsx
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmOutside, setConfirmOutside] = useState(true); // Default to true for testing
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let latitude, longitude;
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        console.log('Geolocation:', { latitude, longitude, confirmOutside });
      } catch (geoError) {
        console.error('Geolocation error:', geoError.message);
        toast.error('Geolocation failed. Please enable location services or check "Confirm login from outside office".');
        setLoading(false);
        return;
      }

      const res = await login({ email, password, latitude, longitude, confirmOutside });
      console.log('Login response:', res); // Debug log
      toast.success('Login successful');
      // Redirect to dynamic dashboard URL using user role and employeeId
      navigate(`/${res.user.role.toLowerCase()}/${res.user.employeeId}/dashboard`);
    } catch (error) {
      console.error('Login error:', error.response?.data, error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      if (error.response?.status === 403) {
        toast.info('You are outside the office location. Please check "Confirm login from outside office".');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-bg-darker bg-opacity-90 backdrop-blur-md rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-primary font-medium hover:text-opacity-80 transition-colors duration-300 font-space-grotesk"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </Link>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white animate-fade-in-down tracking-tight font-space-grotesk">
            Login to HRMS
          </h2>
          <p className="mt-2 text-gray-400 font-share-tech">
            Access your account to manage your workforce
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 font-space-grotesk">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-600 rounded-lg text-white bg-transparent placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300"
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 font-space-grotesk">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-600 rounded-lg text-white bg-transparent placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300"
              required
              placeholder="Enter your password"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={confirmOutside}
              onChange={(e) => setConfirmOutside(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-600 rounded"
            />
            <label htmlFor="confirmOutside" className="ml-2 text-sm text-gray-300 font-space-grotesk">
              Confirm login from outside office
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-md ${
              loading
                ? 'bg-secondary/50 cursor-not-allowed'
                : 'bg-secondary hover:bg-opacity-80'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-4 font-share-tech">
          Don’t have an account?{' '}
          <Link to="/register" className="text-primary hover:text-opacity-80 font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;