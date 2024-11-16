// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Register from './pages/Register';
import Confirmation from './pages/Confirmation';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import AdminRoutes from './routes/AdminRoutes';
import NotFound from './pages/NotFound'; // Importação correta do NotFound


function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rotas Protegidas para Usuários Autenticados */}
            <Route
              path="/booking/:id"
              element={
                <PrivateRoute>
                  <Booking />
                </PrivateRoute>
              }
            />
            <Route
              path="/confirmation"
              element={
                <PrivateRoute>
                  <Confirmation />
                </PrivateRoute>
              }
            />

            {/* Rotas do Painel Admin */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* Rota Padrão para Páginas Não Encontradas */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;