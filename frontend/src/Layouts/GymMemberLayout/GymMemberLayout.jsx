import { Navbar, Nav } from 'react-bootstrap';
import { Outlet, Link, useLocation } from 'react-router-dom';

export default function GymMemberLayout() {
    const loc = useLocation().pathname;

    return (
        <div className="d-flex flex-column vh-100">
            <Navbar bg="dark" variant="dark" sticky="top" className="px-3 w-100">
                <Navbar.Brand as={Link} to="/member">Member Panel</Navbar.Brand>
            </Navbar>

            <div className="flex-grow-1 d-flex overflow-hidden">
                <aside className="border-end bg-light" style={{ width: 220 }}>
                    <Nav className="flex-column p-3 gap-1">
                        <div className="fw-semibold small text-muted">Bookings</div>

                        {/* -------- MUTLAK PATHLAR -------- */}
                        <Nav.Link
                            as={Link}
                            to="/member/create-booking"
                            active={loc === '/member/create-booking'}
                        >
                            Create Booking
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/member/booking-list"
                            active={loc === '/member/booking-list'}
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
