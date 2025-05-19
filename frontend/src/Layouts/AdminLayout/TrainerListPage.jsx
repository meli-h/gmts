import { useEffect, useState } from 'react';
import { getTrainers, deleteTrainer } from '../../api';
import { Table, Button, Spinner, Alert, Pagination } from 'react-bootstrap';

const PAGE_SIZE = 10;

export default function TrainerListPage() {
    const [trainers, setTrainers] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchList = async () => {
        try {
            setLoading(true);
            const data = await getTrainers();
            console.log("Trainers fetched:", data); // Debug log
            setTrainers(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching trainers:", err);
            setError("Failed to load trainers. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchList(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this trainer?')) return;
        try {
            await deleteTrainer(id);
            fetchList();
        } catch (err) {
            alert("Failed to delete trainer");
        }
    };

    if (loading) return <Spinner className="m-5" animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    // Safe access to trainers with fallback
    const trainerData = trainers || [];
    const totalPages = Math.ceil(trainerData.length / PAGE_SIZE) || 1;
    const slice = trainerData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    
    // Ensure page is in bounds
    if (page > totalPages && totalPages > 0) {
        setPage(totalPages);
    }

    return (
        <div>
            <h2 className="mb-4">Trainer List</h2>
            
            <Button onClick={fetchList} className="mb-3" variant="outline-primary">
                Refresh
            </Button>
            
            {trainers && trainers.length === 0 ? (
                <Alert variant="info">No trainers found. Create some trainers first.</Alert>
            ) : (
                <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#ID</th>
                                <th>Name</th>
                                <th>Surname</th>
                                <th>Contact</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {slice.map(t => (
                                <tr key={t.trainer_id}>
                                    <td>{t.trainer_id}</td>
                                    <td>{t.name}</td>
                                    <td>{t.surname}</td>
                                    <td>{t.contactNumber || 'N/A'}</td>
                                    <td>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => handleDelete(t.trainer_id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {totalPages > 1 && (
                        <Pagination className="justify-content-center">
                            <Pagination.Prev
                                onClick={() => setPage(p => Math.max(p - 1, 1))}
                                disabled={page <= 1}
                            />
                            {[...Array(totalPages)].map((_, i) => (
                                <Pagination.Item
                                    key={i + 1}
                                    active={page === i + 1}
                                    onClick={() => setPage(i + 1)}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                                disabled={page >= totalPages}
                            />
                        </Pagination>
                    )}
                </>
            )}
        </div>
    );
}
