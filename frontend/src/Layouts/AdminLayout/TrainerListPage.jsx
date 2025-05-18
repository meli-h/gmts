import { useEffect, useState } from 'react';
import { getTrainers, deleteTrainer } from '../../api';
import { Table, Button, Spinner, Pagination } from 'react-bootstrap';

const PAGE_SIZE = 10;

export default function TrainerListPage() {
    const [trainers, setTrainers] = useState(null);
    const [page, setPage] = useState(1);

    const fetchList = async () => setTrainers(await getTrainers());

    useEffect(() => { fetchList(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this trainer?')) return;
        await deleteTrainer(id);
        fetchList();
    };

    if (!trainers) return <Spinner className="m-5" animation="border" />;

    const totalPages = Math.ceil(trainers.length / PAGE_SIZE) || 1;
    const slice = trainers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    if (page > totalPages) setPage(totalPages);

    const pages = [...Array(totalPages).keys()].map(i => (
        <Pagination.Item key={i + 1} active={page === i + 1} onClick={() => setPage(i + 1)}>
            {i + 1}
        </Pagination.Item>
    ));

    return (
        <div>
            <h2 className="mb-4">Trainer List</h2>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#ID</th><th>Name</th><th>Surname</th><th>Account</th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {slice.map(t => (
                        <tr key={t.trainer_id}>
                            <td>{t.trainer_id}</td>
                            <td>{t.name}</td>
                            <td>{t.surname}</td>
                            <td>{t.account_id}</td>
                            <td>
                                <Button size="sm" variant="danger" onClick={() => handleDelete(t.trainer_id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {trainers.length === 0 &&
                        <tr><td colSpan={5} className="text-center">No trainers yet</td></tr>}
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
