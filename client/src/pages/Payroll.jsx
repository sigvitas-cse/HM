// client/src/pages/Payroll.jsx
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const Payroll = () => {
  const { user } = useContext(AuthContext);
  const [payrolls, setPayrolls] = useState([]);
  const [formData, setFormData] = useState({
    userId: '',
    salary: '',
    deductions: '',
    paymentDate: '',
  });
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/payroll', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setPayrolls(res.data);
      } catch (error) {
        toast.error('Failed to fetch payrolls');
      }
    };
    const fetchEmployees = async () => {
      if (user.role === 'Admin' || user.role === 'HR') {
        try {
          const res = await axios.get('http://localhost:5000/api/employees', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setEmployees(res.data);
        } catch (error) {
          toast.error('Failed to fetch employees');
        }
      }
    };
    fetchPayrolls();
    fetchEmployees();
  }, [user.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/payroll/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        toast.success('Payroll updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/payroll', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        toast.success('Payroll created successfully');
      }
      setFormData({ userId: '', salary: '', deductions: '', paymentDate: '' });
      setEditingId(null);
      const res = await axios.get('http://localhost:5000/api/payroll', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPayrolls(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (payroll) => {
    setEditingId(payroll._id);
    setFormData({
      userId: payroll.userId._id,
      salary: payroll.salary,
      deductions: payroll.deductions,
      paymentDate: new Date(payroll.paymentDate).toISOString().split('T')[0],
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payroll?')) {
      try {
        await axios.delete(`http://localhost:5000/api/payroll/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        toast.success('Payroll deleted successfully');
        setPayrolls(payrolls.filter((payroll) => payroll._id !== id));
      } catch (error) {
        toast.error('Failed to delete payroll');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-white">Payroll Management</h1>
      {(user.role === 'Admin' || user.role === 'HR') && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Employee</label>
              <select
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                className="w-full p-2 border rounded text-gray-500"
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Salary</label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full p-2 border rounded text-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Deductions</label>
              <input
                type="number"
                value={formData.deductions}
                onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                className="w-full p-2 border rounded text-gray-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Payment Date</label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                className="w-full p-2 border rounded text-gray-500"
                required
              />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-blue-600 text-white p-2 rounded">
            {editingId ? 'Update Payroll' : 'Create Payroll'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({ userId: '', salary: '', deductions: '', paymentDate: '' });
              }}
              className="mt-4 ml-4 bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </button>
          )}
        </form>
      )}
      <h2 className="text-2xl font-semibold mb-4 text-white">Payroll Records</h2>
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full text-gray-800">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Employee</th>
              <th className="p-2 text-left">Salary</th>
              <th className="p-2 text-left">Deductions</th>
              <th className="p-2 text-left">Net Pay</th>
              <th className="p-2 text-left">Payment Date</th>
              <th className="p-2 text-left">Status</th>
              {(user.role === 'Admin' || user.role === 'HR') && <th className="p-2 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {payrolls.map((payroll) => (
              <tr key={payroll._id} className="border-b">
                <td className="p-2">{payroll.userId.name}</td>
                <td className="p-2">${payroll.salary}</td>
                <td className="p-2">${payroll.deductions}</td>
                <td className="p-2">${payroll.netPay}</td>
                <td className="p-2">{new Date(payroll.paymentDate).toLocaleDateString()}</td>
                <td className="p-2">{payroll.status}</td>
                {(user.role === 'Admin' || user.role === 'HR') && (
                  <td className="p-2">
                    <button
                      onClick={() => handleEdit(payroll)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(payroll._id)}
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

export default Payroll;