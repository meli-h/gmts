import { useEffect, useState } from 'react';
import { getMembers, deleteMember } from '../../api';
import { Table, Button, Spinner, Pagination } from 'react-bootstrap';

const PAGE_SIZE = 10;

export default function GymMemberListPage() {
    const [members, setMembers] = useState(null);
    const [page, setPage] = useState(1);

    /* ---- fetch helpers ---- */
    const fetchList = async () => setMembers(await getMembers());

    /* ---- initial load ---- */
    useEffect(() => { fetchList(); }, []);

    /* ---- delete with confirm ---- */
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this member?')) return;
        await deleteMember(id);
        fetchList();
    };

    /* ---- loading spinner ---- */
    if (!members) return <Spinner className="m-5" animation="border" />;

    /* ---- pagination math ---- */
    const totalPages = Math.ceil(members.length / PAGE_SIZE) || 1;
    const slice = members.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    /* ---- keep page in bounds (ör. son satırı silince) ---- */
    if (page > totalPages) setPage(totalPages);

    /* ---- pagination items ---- */
    const pages = [...Array(totalPages).keys()].map(i => (
        <Pagination.Item key={i + 1} active={page === i + 1} onClick={() => setPage(i + 1)}>
            {i + 1}
        </Pagination.Item>
    ));

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
                    {slice.map(m => (
                        <tr key={m.gymMember_id}>
                            <td>{m.gymMember_id}</td>
                            <td>{m.name}</td>
                            <td>{m.surname}</td>
                            <td>{m.membership_type}</td>
                            <td>{m.member_start_date?.slice(0, 10) ?? '-'}</td>
                            <td>{m.member_end_date?.slice(0, 10) ?? '-'}</td>
                            <td>
                                <Button size="sm" variant="danger" onClick={() => handleDelete(m.gymMember_id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {members.length === 0 &&
                        <tr><td colSpan={7} className="text-center">No members yet</td></tr>}
                </tbody>
            </Table>

            {totalPages > 1 && (
                <Pagination>
                    <Pagination.Prev onClick={() => page > 1 && setPage(page - 1)} disabled={page === 1} />
                    {pages}
                    <Pagination.Next onClick={() => page < totalPages && setPage(page + 1)} disabled={page === totalPages} />
                </Pagination>
            )}
        </div>
    );
}
