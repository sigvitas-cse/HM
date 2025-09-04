// client/src/pages/Holiday.jsx
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const Holiday = () => {
  const { user } = useContext(AuthContext);
  const [holidays, setHolidays] = useState([]);
  const [formData, setFormData] = useState({ name: '', date: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/holidays`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setHolidays(res.data);
      } catch (error) {
        toast.error('Failed to fetch holidays');
      }
    };
    fetchHolidays();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/holidays/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        toast.success('Holiday updated successfully');
      } else {
        await axios.post(`${API_URL}/api/holidays`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        toast.success('Holiday added successfully');
      }
      setFormData({ name: '', date: '', description: '' });
      setEditingId(null);
      const res = await axios.get(`${API_URL}/api/holidays`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setHolidays(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (holiday) => {
    setEditingId(holiday._id);
    setFormData({
      name: holiday.name,
      date: new Date(holiday.date).toISOString().split('T')[0],
      description: holiday.description || '',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this holiday?')) {
      try {
        await axios.delete(`${API_URL}/api/holidays/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        toast.success('Holiday deleted successfully');
        setHolidays(holidays.filter((holiday) => holiday._id !== id));
      } catch (error) {
        toast.error('Failed to delete holiday');
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-white">Holiday Management</h1>
      {(user.role === 'Admin' || user.role === 'HR') && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Holiday Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-blue-600 text-white p-2 rounded">
            {editingId ? 'Update Holiday' : 'Add Holiday'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({ name: '', date: '', description: '' });
              }}
              className="mt-4 ml-4 bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </button>
          )}
        </form>
      )}
      <h2 className="text-2xl font-semibold mb-4 text-white">Holiday List</h2>
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full text-gray-800">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Description</th>
              {(user.role === 'Admin' || user.role === 'HR') && <th className="p-2 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {holidays.map((holiday) => (
              <tr key={holiday._id} className="border-b">
                <td className="p-2">{holiday.name}</td>
                <td className="p-2">{new Date(holiday.date).toLocaleDateString()}</td>
                <td className="p-2">{holiday.description || 'N/A'}</td>
                {(user.role === 'Admin' || user.role === 'HR') && (
                  <td className="p-2">
                    <button
                      onClick={() => handleEdit(holiday)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(holiday._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Holiday;