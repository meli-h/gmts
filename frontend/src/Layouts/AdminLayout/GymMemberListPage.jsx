// src/Layouts/AdminLayout/GymMemberListPage.jsx
import { useEffect, useState } from 'react';
import { getMembers, deleteMember } from '../../api';
import { Table, Button, Spinner } from 'react-bootstrap';

const ENDPOINT = {
    trainers: '/api/trainers',
    members: '/api/gym-members',   // <-- /api/gym-members DEĞİL!
};



export default function GymMemberListPage() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchList(); }, []);

    const fetchList = async () => {
        setLoading(true);
        setMembers(await getMembers());
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this member?')) return;
        await deleteMember(id);
        setMembers(members.filter(m => m.gymMember_id !== id));
    };

    if (loading) return <Spinner className="m-5" animation="border" />;

    return (
        <div>
            <h2 className="mb-4">Gym Member List</h2>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#ID</th><th>Name</th><th>Surname</th>
                        <th>Membership</th><th>Start</th><th>End</th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {members.map(m => (
                        <tr key={m.gymMember_id}>
                            <td>{m.gymMember_id}</td>
                            <td>{m.name}</td>
                            <td>{m.surname}</td>
                            <td>{m.membership_type}</td>
                            <td>{m.member_start_date ?? '-'}</td>
                            <td>{m.member_end_date ?? '-'}</td>
                            <td>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => handleDelete(m.gymMember_id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {members.length === 0 && (
                        <tr><td colSpan={7} className="text-center">No members yet</td></tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
}
