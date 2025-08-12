// client/src/pages/Dashboard.jsx
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome, {user.name}</h2>
      <div className="bg-white p-6 rounded shadow-md mb-6">
        <p><strong>Employee ID:</strong> {user.employeeId}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(user.role === 'Admin' || user.role === 'HR' || user.role === 'Employee') && (
          <>
            <Link
              to="/attendance"
              className="bg-blue-600 text-white p-4 rounded hover:bg-blue-700 transition-colors"
            >
              Attendance
            </Link>
            <Link
              to="/leaves"
              className="bg-blue-600 text-white p-4 rounded hover:bg-blue-700 transition-colors"
            >
              Leave Management
            </Link>
            <Link
              to="/payroll"
              className="bg-blue-600 text-white p-4 rounded hover:bg-blue-700 transition-colors"
            >
              Payroll
            </Link>
            <Link
              to="/notices"
              className="bg-blue-600 text-white p-4 rounded hover:bg-blue-700 transition-colors"
            >
              Notices
            </Link>
            <Link
              to="/holidays"
              className="bg-blue-600 text-white p-4 rounded hover:bg-blue-700 transition-colors"
            >
              Holidays
            </Link>
          </>
        )}
        {user.role === 'Admin' && (
          <Link
            to="/admin/employees"
            className="bg-blue-600 text-white p-4 rounded hover:bg-blue-700 transition-colors"
          >
            Employee Management
          </Link>
        )}
      </div>
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;