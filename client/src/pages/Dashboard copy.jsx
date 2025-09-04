import { useContext, useEffect, useState } from 'react';
import { useParams, Outlet, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { role, userId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role.toLowerCase() !== role || user.employeeId !== userId) {
      toast.error('Unauthorized access or invalid user');
    }
  }, [user, role, userId]);

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-white font-space-grotesk animate-pulse">Loading...</div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        await logout(); // Clears local storage and context
        toast.success(data.message || 'Logged out successfully');
      } else {
        toast.error(data.message || 'Logout failed');
      }
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleToggleSidebar = () => {
    console.log('Toggling sidebar, new state:', !sidebarOpen); // Debug log
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark text-gray-300 flex flex-row font-space-grotesk">
      {/* Sidebar */}
      <div
        className="fixed inset-y-0 left-0 w-64 bg-bg-darker bg-opacity-95 backdrop-blur-md z-50 h-screen overflow-y-auto"
        onClick={handleCloseSidebar} // Close on click outside (sidebar area)
      >
        <div className="p-6 h-full flex flex-col border-r-2">
          <h2 className="text-2xl font-bold text-white mb-6 font-space-grotesk">HRMS Dashboard</h2>
          <nav className="flex-1">
            <ul className="space-y-2">
              {(user.role === 'Admin' || user.role === 'HR' || user.role === 'Employee') && (
                <>
                  <li>
                    <Link
                      to={`/${role}/${userId}/dashboard/attendance`}
                      className="flex items-center p-2 rounded-lg hover:bg-primary hover:bg-opacity-20 text-white transition-colors"
                      onClick={handleCloseSidebar}
                    >
                      <span className="ml-2">Attendance</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/${role}/${userId}/dashboard/leaves`}
                      className="flex items-center p-2 rounded-lg hover:bg-primary hover:bg-opacity-20 text-white transition-colors"
                      onClick={handleCloseSidebar}
                    >
                      <span className="ml-2">Leave Management</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/${role}/${userId}/dashboard/payroll`}
                      className="flex items-center p-2 rounded-lg hover:bg-primary hover:bg-opacity-20 text-white transition-colors"
                      onClick={handleCloseSidebar}
                    >
                      <span className="ml-2">Payroll</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/${role}/${userId}/dashboard/notices`}
                      className="flex items-center p-2 rounded-lg hover:bg-primary hover:bg-opacity-20 text-white transition-colors"
                      onClick={handleCloseSidebar}
                    >
                      <span className="ml-2">Notices</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/${role}/${userId}/dashboard/holidays`}
                      className="flex items-center p-2 rounded-lg hover:bg-primary hover:bg-opacity-20 text-white transition-colors"
                      onClick={handleCloseSidebar}
                    >
                      <span className="ml-2">Holidays</span>
                    </Link>
                  </li>
                </>
              )}
              {user.role === 'Admin' && (
                <li>
                  <Link
                    to={`/${role}/${userId}/dashboard/employees`}
                    className="flex items-center p-2 rounded-lg hover:bg-primary hover:bg-opacity-20 text-white transition-colors"
                    onClick={handleCloseSidebar}
                  >
                    <span className="ml-2">Employee Management</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          <button
            onClick={handleCloseSidebar}
            className="lg:hidden mt-4 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 pl-4">
        {/* Header */}
        <header className="sticky top-0 bg-bg-darker bg-opacity-90 backdrop-blur-md p-4 mx-6 rounded-b-lg mb-6 flex justify-between items-center border-b-4 z-40">
          <button
            onClick={handleToggleSidebar}
            className="lg:hidden text-primary focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <div className="text-white font-space-grotesk">
            <p className="font-semibold">Welcome, {user.name}</p>
            <p className="text-sm text-gray-400">Role: {user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors"
          >
            Logout
          </button>
        </header>

        {/* Content Area */}
        <main className="bg-bg-darker bg-opacity-90 p-0 rounded-lg shadow-lg h-[calc(95vh-64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;