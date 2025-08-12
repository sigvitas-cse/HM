// client/src/pages/Attendance.jsx
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Attendance = () => {
  const { user } = useContext(AuthContext);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/attendance/history', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAttendance(res.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch attendance history');
      }
    };
    if (user) {
      fetchAttendance();
    }
  }, [user]);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h2 className="text-2xl font-bold mb-4 text-white">Attendance History</h2>
      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Attendance for {user?.name} ({user?.employeeId})</h3>
        {attendance.length === 0 ? (
          <p className='text-gray-800'>No attendance records found.</p>
        ) : (
          <table className="w-full border-collapse text-gray-800">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Date</th>
                <th className="border p-2">Login Time</th>
                <th className="border p-2">Logout Time</th>
                <th className="border p-2">Work Hours</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Location</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record._id}>
                  <td className="border p-2">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="border p-2">{new Date(record.loginTime).toLocaleTimeString()}</td>
                  <td className="border p-2">
                    {record.logoutTime ? new Date(record.logoutTime).toLocaleTimeString() : '-'}
                  </td>
                  <td className="border p-2">{record.workHours ? record.workHours.toFixed(2) : '-'}</td>
                  <td className="border p-2">{record.status}</td>
                  <td className="border p-2">
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
  );
};

export default Attendance;