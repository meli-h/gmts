// src/Layouts/GymMemberLayout/GymMemberLayout.jsx
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Outlet, Link, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export default function GymMemberLayout() {
  const loc = useLocation().pathname;
  const { memberId } = useParams();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="d-flex flex-column vh-100">
      <Navbar bg="dark" variant="dark" sticky="top" className="px-3 w-100">
        <Container fluid className="p-0">
          <Navbar.Brand as={Link} to={`/member/${memberId}/booking-list`}>
            Member Panel
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/login" className="text-white" onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <div className="flex-grow-1 d-flex overflow-hidden">
        <aside className="border-end bg-light" style={{ width: 220 }}>
          <Nav className="flex-column p-3 gap-1">
            <div className="fw-semibold small text-muted">Bookings</div>
            <Nav.Link
              as={Link}
              to={`/member/${memberId}/create-booking`}
              active={loc === `/member/${memberId}/create-booking`}
            >
              Create Booking
            </Nav.Link>
            <Nav.Link
              as={Link}
              to={`/member/${memberId}/booking-list`}
              active={loc === `/member/${memberId}/booking-list`}
            >
              Booking List
            </Nav.Link>
          </Nav>
        </aside>
        <main className="flex-grow-1 overflow-auto p-4 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
