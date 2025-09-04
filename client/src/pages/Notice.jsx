import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { FaSpinner } from 'react-icons/fa'; // Install react-icons if not already installed

const Notice = () => {
  const { user } = useContext(AuthContext);
  const [notices, setNotices] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '', targetUsers: [] });
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading

  const API_URL = import.meta.env.VITE_API_URL;
  // console.log("API URL:", API_URL); // debug

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/notices`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log("Notices response:", res.data);
        setNotices(res.data   || []);
      } catch (error) {
        toast.error('Failed to fetch notices');
      }
    };
    const fetchEmployees = async () => {
      if (user.role === 'Admin' || user.role === 'HR') {
        try {
          const res = await axios.get(`${API_URL}/api/employees`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setEmployees(res.data);
        } catch (error) {
          toast.error('Failed to fetch employees');
        }
      }
    };
    fetchNotices();
    fetchEmployees();
  }, [user.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Start loading
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/notices/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        toast.success('Notice updated successfully', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        await axios.post(`${API_URL}/api/notices`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        toast.success('Notice posted successfully', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
      setFormData({ title: '', content: '', targetUsers: [] });
      setEditingId(null);
      const res = await axios.get(`${API_URL}/api/notices`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setNotices(res.data);
      // Add a temporary highlight to the form
      const form = document.querySelector('form');
      form.classList.add('bg-green-100', 'border-green-400');
      setTimeout(() => form.classList.remove('bg-green-100', 'border-green-400'), 2000); // Remove after 2 seconds
    } catch (error) {
      console.error('Error in handleSubmit:', error.response?.data, error);
      toast.error(error.response?.data?.message || 'Operation failed', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  const handleEdit = (notice) => {
    setEditingId(notice._id);
    setFormData({
      title: notice.title,
      content: notice.content,
      targetUsers: notice.targetUsers.map((id) => id.toString()),
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await axios.delete(`${API_URL}/api/notices/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        toast.success('Notice deleted successfully', {
          position: 'top-right',
          autoClose: 3000,
        });
        setNotices(notices.filter((notice) => notice._id !== id));
      } catch (error) {
        toast.error('Failed to delete notice', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-white">Notice Board</h1>
      {(user.role === 'Admin' || user.role === 'HR') && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border rounded block text-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full p-2 border rounded text-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Target Users (Leave empty for all)</label>
              <select
                multiple
                value={formData.targetUsers}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetUsers: Array.from(e.target.selectedOptions, (option) => option.value),
                  })
                }
                className="w-full p-2 border rounded text-gray-500"
              >
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.email})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> {editingId ? 'Updating...' : 'Posting...'}
              </>
            ) : (
              editingId ? 'Update Notice' : 'Post Notice'
            )}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({ title: '', content: '', targetUsers: [] });
              }}
              className="mt-4 ml-4 bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </button>
          )}
        </form>
      )}
      <h2 className="text-2xl font-semibold mb-4 text-white">Notices</h2>
      <div className="bg-white p-4 rounded shadow">
        {notices.map((notice) => (
          <div key={notice._id} className="border-b p-4">
            <h3 className="text-xl font-semibold text-gray-600">{notice.title}</h3>
            <p className="text-gray-600">{notice.content}</p>
            <p className="text-sm text-gray-500">
              Posted by {notice.createdBy?.name || 'Unknown'} on{' '}
              {new Date(notice.postedAt).toLocaleDateString()}
            </p>
            {(user.role === 'Admin' || user.role === 'HR') && (
              <div className="mt-2">
                <button
                  onClick={() => handleEdit(notice)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(notice._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notice;