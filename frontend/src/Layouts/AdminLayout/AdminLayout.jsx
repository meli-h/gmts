import { Navbar, Nav } from 'react-bootstrap';
import { Outlet, Link, useLocation } from 'react-router-dom';

export default function AdminLayout() {
    const loc = useLocation().pathname;      // aktif link vurgusu

    return (
        <div className="d-flex flex-column vh-100">
            {/* üst bar tam genişlik */}
            <Navbar bg="dark" variant="dark" sticky="top" className="px-3 w-100">
                <Navbar.Brand as={Link} to="/admin">Gym Admin</Navbar.Brand>
            </Navbar>

            <div className="flex-grow-1 d-flex overflow-hidden">
                {/* sidebar */}
                <aside className="border-end bg-light" style={{ width: 220 }}>
                    <Nav className="flex-column p-3 gap-1">
                        <div className="fw-semibold small text-muted">Trainer</div>

                        <Nav.Link
                            as={Link}
                            to="/admin/create-trainer"
                            active={loc === '/admin/create-trainer'}
                        >
                            Create Trainer
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/admin/trainer-list"
                            active={loc === '/admin/trainer-list'}
                        >
                            Trainer List
                        </Nav.Link>

                        <div className="fw-semibold small text-muted mt-4">Gym&nbsp;Member</div>

                        <Nav.Link
                            as={Link}
                            to="/admin/create-member"
                            active={loc === '/admin/create-member'}
                        >
                            Create Member
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/admin/member-list"
                            active={loc === '/admin/member-list'}
                        >
                            Member List
                        </Nav.Link>
                    </Nav>
                </aside>

                {/* alt rotalar */}
                <main className="flex-grow-1 overflow-auto p-4 bg-white">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
