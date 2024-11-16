import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaFutbol, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/admin">
            Painel Administrativo
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="admin-navbar-nav" />
          <Navbar.Collapse id="admin-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                as={Link} 
                to="/admin" 
                active={location.pathname === '/admin'}
              >
                <FaHome className="me-1" /> Dashboard
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/admin/users"
                active={location.pathname === '/admin/users'}
              >
                <FaUsers className="me-1" /> Usuários
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/admin/courts"
                active={location.pathname === '/admin/courts'}
              >
                <FaFutbol className="me-1" /> Quadras
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/admin/reservations"
                active={location.pathname === '/admin/reservations'}
              >
                <FaCalendarAlt className="me-1" /> Reservas
              </Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link as={Link} to="/" className="me-3">
                Ir para o Site
              </Nav.Link>
              <Nav.Link onClick={logout}>
                <FaSignOutAlt className="me-1" /> Sair
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-4">
        <Outlet />
      </Container>
    </>
  );
};

export default AdminLayout; 