// client/src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Employee',
    employeeId: '',
    department: '',
    designation: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      toast.success('Registration successful');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-bg-darker bg-opacity-90 backdrop-blur-md rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-primary font-medium hover:text-opacity-80 transition-colors duration-300"
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
            Register for HRMS
          </h2>
          <p className="mt-2 text-gray-400 font-share-tech">
            Create your account to manage your workforce efficiently
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 font-space-grotesk">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full p-3 border border-gray-600 rounded-lg text-white bg-transparent placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 font-space-grotesk">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full p-3 border border-gray-600 rounded-lg text-white bg-transparent placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 font-space-grotesk">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full p-3 border border-gray-600 rounded-lg text-white bg-transparent placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300"
                placeholder="Enter your password"
                required
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 font-space-grotesk">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 w-full p-3 border border-gray-600 rounded-lg text-white bg-transparent focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300"
                required
              >
                <option value="Employee" className="text-gray-800 bg-gray-600">Employee</option>
                <option value="HR" className="text-gray-800 bg-gray-600">HR</option>
                <option value="Admin" className="text-gray-800 bg-gray-600">Admin</option>
              </select>
            </div>
            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-300 font-space-grotesk">
                Employee ID
              </label>
              <input
                id="employeeId"
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="mt-1 w-full p-3 border border-gray-600 rounded-lg text-white bg-transparent placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300"
                placeholder="Enter your employee ID"
                required
              />
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-300 font-space-grotesk">
                Department
              </label>
              <input
                id="department"
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="mt-1 w-full p-3 border border-gray-600 rounded-lg text-white bg-transparent placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300"
                placeholder="Enter your department"
              />
            </div>
            <div>
              <label htmlFor="designation" className="block text-sm font-medium text-gray-300 font-space-grotesk">
                Designation
              </label>
              <input
                id="designation"
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="mt-1 w-full p-3 border border-gray-600 rounded-lg text-white bg-transparent placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300"
                placeholder="Enter your designation"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 font-space-grotesk">
                Phone Number
              </label>
              <input
                id="phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 w-full p-3 border border-gray-600 rounded-lg text-white bg-transparent placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-300 font-space-grotesk">
                Address
              </label>
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 w-full p-3 border border-gray-600 rounded-lg text-white bg-transparent placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300"
                placeholder="Enter your address"
              />
            </div>
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-4 font-share-tech">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-opacity-80 font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;