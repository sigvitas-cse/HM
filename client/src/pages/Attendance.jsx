// client/src/pages/Attendance.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Attendance = () => {
  const { user } = useContext(AuthContext);
  const { userId } = useParams(); // Keep for display, but not for API
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/attendance/history`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('API Response:', res.data); // Debug log
        setAttendance(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Fetch error:', error.response?.data, error);
        toast.error(error.response?.data?.message || 'Failed to fetch attendance history');
        setAttendance([]);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchAttendance();
    }
  }, [user, API_URL]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/attendance/history`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('Refresh Response:', res.data); // Debug log
      setAttendance(Array.isArray(res.data) ? res.data : []);
      toast.success('Attendance refreshed successfully');
    } catch (error) {
      console.error('Refresh error:', error.response?.data, error);
      toast.error(error.response?.data?.message || 'Failed to refresh attendance history');
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex justify-center py-0 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full w-full bg-bg-darker bg-opacity-90 backdrop-blur-md rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
        {/* <Link
          to={`/${user?.role?.toLowerCase()}/${userId}/dashboard`}
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
          Back to Dashboard
        </Link> */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white animate-fade-in-down tracking-tight font-space-grotesk">
            Attendance History
          </h2>
          <p className="mt-2 text-gray-400 font-share-tech">
            View your attendance records
          </p>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-300 font-space-grotesk">
            Attendance for {user?.name} ({userId})
          </h3>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 ${
              loading
                ? 'bg-secondary/50 cursor-not-allowed'
                : 'bg-secondary hover:bg-opacity-80'
            }`}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        <div className="overflow-x-auto">
          {attendance.length === 0 ? (
            <p className="text-gray-400 text-center py-4 font-share-tech">
              No attendance records found.
            </p>
          ) : (
            <table className="w-full border-collapse text-gray-300">
              <thead>
                <tr className="bg-bg-darker border-b border-gray-600">
                  <th className="p-3 text-left font-space-grotesk">Date</th>
                  <th className="p-3 text-left font-space-grotesk">Login Time</th>
                  <th className="p-3 text-left font-space-grotesk">Logout Time</th>
                  <th className="p-3 text-left font-space-grotesk">Work Hours</th>
                  <th className="p-3 text-left font-space-grotesk">Status</th>
                  <th className="p-3 text-left font-space-grotesk">Location</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(attendance) && attendance.map((record) => (
                  <tr
                    key={record._id}
                    className="border-b border-gray-600 hover:bg-bg-darker/50 transition-colors duration-200"
                  >
                    <td className="p-3">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="p-3">{new Date(record.loginTime).toLocaleTimeString()}</td>
                    <td className="p-3">
                      {record.logoutTime ? new Date(record.logoutTime).toLocaleTimeString() : '-'}
                    </td>
                    <td className="p-3">{record.workHours ? record.workHours.toFixed(2) : '-'}</td>
                    <td className="p-3">{record.status}</td>
                    <td className="p-3">
                      {record.loginLocation
                        ? `${record.loginLocation.latitude}, ${record.loginLocation.longitude}`
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;