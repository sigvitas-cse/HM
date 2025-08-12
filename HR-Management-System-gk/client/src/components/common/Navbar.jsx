// client/src/components/common/Navbar.jsx
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={user ? `/${user.role.toLowerCase()}/dashboard` : '/'} className="text-xl font-bold">
          HRMS
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link to={`/${user.role.toLowerCase()}/dashboard`}>Dashboard</Link>
              {(user.role === 'Admin' || user.role === 'HR') && (
                <Link to="/admin/employees">Employees</Link>
              )}
              <Link to="/attendance">Attendance</Link>
              <Link to="/leaves">Leaves</Link>
              <Link to="/holidays">Holidays</Link>
              <Link to="/notices">Notices</Link>
              <Link to="/payroll">Payroll</Link>
              <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;