// frontend/src/routes/AdminRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminRoute from './AdminRoute';
import AdminDashboard from '../pages/Admin/Dashboard';
import UserManagement from '../pages/Admin/UserManagement';
import CourtManagement from '../pages/Admin/CourtManagement';
import ReservationManagement from '../pages/Admin/ReservationManagement';
import AdminLayout from '../components/layouts/AdminLayout';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="courts" element={<CourtManagement />} />
        <Route path="reservations" element={<ReservationManagement />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;