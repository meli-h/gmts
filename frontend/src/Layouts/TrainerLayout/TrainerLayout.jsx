import { Navbar, Nav } from 'react-bootstrap';
import { Outlet, Link, useLocation } from 'react-router-dom';

export default function TrainerLayout() {
    const loc = useLocation().pathname;
    const active = (slug) => loc.endsWith(slug);

    return (
        <div className="d-flex flex-column vh-100">
            {/* Top bar – tam genişlik */}
            <Navbar bg="dark" variant="dark" className="px-3" sticky="top" style={{ minWidth: '100vw' }}>
                <Navbar.Brand as={Link} to="/trainer">Trainer Page</Navbar.Brand>
            </Navbar>

            <div className="flex-grow-1 d-flex overflow-hidden">
                {/* Sidebar */}
                <aside className="border-end bg-light" style={{ width: 220 }}>
                    <Nav className="flex-column p-3 gap-1">
                        <div className="fw-semibold small text-muted">Classes</div>
                        <Nav.Link as={Link} to="create-class" active={active('create-class')}>
                            Create Class
                        </Nav.Link>
                        <Nav.Link as={Link} to="class-list" active={active('class-list')}>
                            Class List
                        </Nav.Link>
                    </Nav>
                </aside>

                {/* Nested routes */}
                <main className="flex-grow-1 overflow-auto p-4 bg-white">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
