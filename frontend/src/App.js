// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import AdminRoutes from './routes/AdminRoutes';

// Importação de componentes
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Booking from './pages/Booking';
import Confirmation from './pages/Confirmation';
// ... outros imports necessários

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rotas Privadas */}
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/booking/:courtId" 
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

            {/* Rotas Administrativas */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* Rota 404 */}
            <Route path="*" element={<div>Página não encontrada</div>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;