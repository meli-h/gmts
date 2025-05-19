import { Navbar, Nav } from 'react-bootstrap';
import { Outlet, Link, useLocation } from 'react-router-dom';

export default function TrainerLayout() {
    const loc = useLocation().pathname;

    return (
        <div className="d-flex flex-column vh-100">
            <Navbar bg="dark" variant="dark" sticky="top" className="px-3 w-100">
                <Navbar.Brand as={Link} to="/trainer">Trainer Panel</Navbar.Brand>
            </Navbar>

            <div className="flex-grow-1 d-flex overflow-hidden">
                <aside className="border-end bg-light" style={{ width: 220 }}>
                    <Nav className="flex-column p-3 gap-1">
                        <div className="fw-semibold small text-muted">Classes</div>

                        {/* -------- MUTLAK PATHLAR -------- */}
                        <Nav.Link
                            as={Link}
                            to="/trainer/create-class"
                            active={loc === '/trainer/create-class'}
                        >
                            Create Class
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/trainer/class-list"
                            active={loc === '/trainer/class-list'}
                        >
                            Class List
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
