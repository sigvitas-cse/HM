// client/src/pages/admin/EmployeeManagement.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    email: '', password: '', name: '', role: 'Employee', employeeId: '', department: '', designation: '', phone: '', address: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/employees', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setEmployees(res.data);
      } catch (error) {
        toast.error('Failed to fetch employees');
      }
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/employees/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        toast.success('Employee updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/employees', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        toast.success('Employee registered successfully');
      }
      setFormData({ email: '', password: '', name: '', role: 'Employee', employeeId: '', department: '', designation: '', phone: '', address: '' });
      setEditingId(null);
      const res = await axios.get('http://localhost:5000/api/employees', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEmployees(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee._id);
    setFormData({
      email: employee.email,
      password: '',
      name: employee.name,
      role: employee.role,
      employeeId: employee.employeeId,
      department: employee.department || '',
      designation: employee.designation || '',
      phone: employee.phone || '',
      address: employee.address || '',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:5000/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        toast.success('Employee deleted successfully');
        setEmployees(employees.filter((emp) => emp._id !== id));
      } catch (error) {
        toast.error('Failed to delete employee');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-white">Employee Management</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded text-gray-600"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Password {editingId && '(Leave blank to keep unchanged)'}</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2 border rounded text-gray-600"
              required={!editingId}
            />
          </div>
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded text-gray-600"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full p-2 border rounded text-gray-600"
            >
              <option value="Employee">Employee</option>
              <option value="HR">HR</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Employee ID</label>
            <input
              type="text"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full p-2 border rounded text-gray-600"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full p-2 border rounded text-gray-600"
            />
          </div>
          <div>
            <label className="block text-gray-700">Designation</label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full p-2 border rounded text-gray-600"
            />
          </div>
          <div>
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2 border rounded text-gray-600"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2 border rounded text-gray-600"
            />
          </div>
        </div>
        <button type="submit" className="mt-4 bg-blue-600 text-white p-2 rounded">
          {editingId ? 'Update Employee' : 'Register Employee'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormData({ email: '', password: '', name: '', role: 'Employee', employeeId: '', department: '', designation: '', phone: '', address: '' });
            }}
            className="mt-4 ml-4 bg-gray-500 text-white p-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>
      <h2 className="text-2xl font-semibold mb-4">Employee List</h2>
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full text-gray-600">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Employee ID</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="border-b">
                <td className="p-2">{emp.name}</td>
                <td className="p-2">{emp.email}</td>
                <td className="p-2">{emp.role}</td>
                <td className="p-2">{emp.employeeId}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEdit(emp)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(emp._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeManagement;