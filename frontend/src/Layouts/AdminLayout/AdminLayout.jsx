import { Navbar, Nav } from 'react-bootstrap';
import { Outlet, Link } from 'react-router-dom';

const ENDPOINT = {
    trainers: '/api/trainers',
    members: '/api/gym-members',   // <-- /api/gym-members DEĞİL!
};


export default function AdminLayout() {
    return (
        <div className="d-flex flex-column vh-100">
            {/* Üst bar */}
            <Navbar bg="dark" variant="dark" className="px-3" sticky="top">
                <Navbar.Brand as={Link} to="/admin">Gym Admin</Navbar.Brand>
            </Navbar>

            {/* Yan menü + içerik */}
            <div className="flex-grow-1 d-flex overflow-hidden">
                <aside className="border-end bg-light" style={{ width: 220 }}>
                    <Nav className="flex-column p-3">
                        <Nav.Item className="fw-bold small text-muted mb-1">Trainer</Nav.Item>
                        <Nav.Link as={Link} to="create-trainer">Create Trainer</Nav.Link>
                        <Nav.Link as={Link} to="trainer-list">Trainer List</Nav.Link>

                        <Nav.Item className="fw-bold small text-muted mt-4 mb-1">Gym&nbsp;Member</Nav.Item>
                        <Nav.Link as={Link} to="create-member">Create Member</Nav.Link>
                        <Nav.Link as={Link} to="member-list">Member List</Nav.Link>
                    </Nav>
                </aside>

                <main className="flex-grow-1 overflow-auto p-4 bg-white">
                    {/* Alt route içerikleri burada render edilir */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
