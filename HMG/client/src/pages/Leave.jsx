// client/src/pages/Leave.jsx
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Leave = () => {
  const { user } = useContext(AuthContext);
  const [leaves, setLeaves] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/leaves', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setLeaves(res.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch leaves');
      }
    };
    if (user) {
      fetchLeaves();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/leaves',
        { startDate, endDate, reason },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Leave applied successfully');
      setStartDate('');
      setEndDate('');
      setReason('');
      const res = await axios.get('http://localhost:5000/api/leaves', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setLeaves(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply leave');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h2 className="text-2xl font-bold mb-4 text-white">Leave Management</h2>
      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Apply for Leave</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded text-gray-600"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded text-gray-600"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border rounded text-gray-600"
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Apply
          </button>
        </form>
      </div>
      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Leave History</h3>
        {leaves.length === 0 ? (
          <p className='text-gray-600'>No leave records found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
                <tr className="bg-gray-100 text-gray-700">
                <th className="border p-2">Start Date</th>
                <th className="border p-2">End Date</th>
                <th className="border p-2">Reason</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id}>
                  <td className="border p-2">{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td className="border p-2">{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td className="border p-2">{leave.reason}</td>
                  <td className="border p-2">{leave.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leave;