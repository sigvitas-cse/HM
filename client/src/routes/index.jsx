// client/src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Attendance from '../pages/Attendance';
import Leave from '../pages/Leave';
import Payroll from '../pages/Payroll';
import Notice from '../pages/Notice';
import Holiday from '../pages/Holiday';
import EmployeeManagement from '../pages/admin/EmployeeManagement';
import ProtectedRoute from '../components/common/ProtectedRoute';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route
      path="/:role/:userId/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    >
      <Route
        path="attendance"
        element={
          <ProtectedRoute role={['Admin', 'HR', 'Employee']}>
            <Attendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="leaves"
        element={
          <ProtectedRoute role={['Admin', 'HR', 'Employee']}>
            <Leave />
          </ProtectedRoute>
        }
      />
      <Route
        path="payroll"
        element={
          <ProtectedRoute role={['Admin', 'HR', 'Employee']}>
            <Payroll />
          </ProtectedRoute>
        }
      />
      <Route
        path="notices"
        element={
          <ProtectedRoute role={['Admin', 'HR', 'Employee']}>
            <Notice />
          </ProtectedRoute>
        }
      />
      <Route
        path="holidays"
        element={
          <ProtectedRoute role={['Admin', 'HR', 'Employee']}>
            <Holiday />
          </ProtectedRoute>
        }
      />
    </Route>
    <Route
      path="/admin/employees"
      element={
        <ProtectedRoute role="Admin">
          <EmployeeManagement />
        </ProtectedRoute>
      }
    />
    {/* Fallback route for invalid URLs */}
    <Route path="*" element={<Home />} />
  </Routes>
);

export default AppRoutes;