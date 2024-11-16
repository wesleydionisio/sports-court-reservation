// frontend/src/routes/AdminRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../components/Admin/Dashboard';
import CourtsList from '../components/Admin/Courts/CourtsList';
import AddCourt from '../components/Admin/Courts/AddCourt';
import EditCourt from '../components/Admin/Courts/EditCourt';
import UsersList from '../components/Admin/Users/UsersList';
import AddUser from '../components/Admin/Users/AddUser';
import EditUser from '../components/Admin/Users/EditUser';
import ReservationsList from '../components/Admin/Reservations/ReservationsList';
import AddReservation from '../components/Admin/Reservations/AddReservation';
import EditReservation from '../components/Admin/Reservations/EditReservation';
import AdminRoute from '../middlewares/AdminRoute';

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Rotas Aninhadas sem o prefixo /admin */}
      <Route path="dashboard" element={<Dashboard />} />
      
      {/* Quadras */}
      <Route path="courts" element={<CourtsList />} />
      <Route path="courts/add" element={<AddCourt />} />
      <Route path="courts/edit/:id" element={<EditCourt />} />
      
      {/* Usuários */}
      <Route path="users" element={<UsersList />} />
      <Route path="users/add" element={<AddUser />} />
      <Route path="users/edit/:id" element={<EditUser />} />
      
      {/* Reservas */}
      <Route path="reservations" element={<ReservationsList />} />
      <Route path="reservations/add" element={<AddReservation />} />
      <Route path="reservations/edit/:id" element={<EditReservation />} />
    </Routes>
  );
};

export default AdminRoutes;