// src/Layouts/TrainerLayout/TrainerLayout.jsx
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Outlet, Link, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export default function TrainerLayout() {
  const loc = useLocation().pathname;      // aktif link vurgusu
  const { trainerId } = useParams();       // URL'den trainerId'yi alıyoruz
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="d-flex flex-column vh-100">
      {/* Üst bar tam genişlik */}
      <Navbar bg="dark" variant="dark" sticky="top" className="px-3 w-100">
        <Container fluid className="p-0">
          <Navbar.Brand as={Link} to={`/trainer/${trainerId}/class-list`}>
            Trainer Panel
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/login" className="text-white" onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <div className="flex-grow-1 d-flex overflow-hidden">
        {/* Sidebar */}
        <aside className="border-end bg-light" style={{ width: 220 }}>
          <Nav className="flex-column p-3 gap-1">

            <div className="fw-semibold small text-muted">Classes</div>

            <Nav.Link
              as={Link}
              to={`/trainer/${trainerId}/create-class`}
              active={loc === `/trainer/${trainerId}/create-class`}
            >
              Create Class
            </Nav.Link>

            <Nav.Link
              as={Link}
              to={`/trainer/${trainerId}/class-list`}
              active={loc === `/trainer/${trainerId}/class-list`}
            >
              Class List
            </Nav.Link>

          </Nav>
        </aside>

        {/* Alt rotalar */}
        <main className="flex-grow-1 overflow-auto p-4 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
