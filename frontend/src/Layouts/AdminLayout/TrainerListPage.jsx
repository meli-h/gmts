// src/Layouts/AdminLayout/TrainerListPage.jsx
import { useEffect, useState } from 'react';
import { getTrainers, deleteTrainer } from '../../api';
import { Table, Button, Spinner } from 'react-bootstrap';

const ENDPOINT = {
    trainers: '/api/trainers',
    members: '/api/gym-members',   // <-- /api/gym-members DEĞİL!
};



export default function TrainerListPage() {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ---- initial fetch ---- */
    useEffect(() => { fetchList(); }, []);

    const fetchList = async () => {
        setLoading(true);
        setTrainers(await getTrainers());
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this trainer?')) return;
        await deleteTrainer(id);
        setTrainers(trainers.filter(t => t.trainer_id !== id));
    };

    if (loading) return <Spinner className="m-5" animation="border" />;

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
                    {trainers.map(t => (
                        <tr key={t.trainer_id}>
                            <td>{t.trainer_id}</td>
                            <td>{t.name}</td>
                            <td>{t.surname}</td>
                            <td>{t.account_id}</td>
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
                    {trainers.length === 0 && (
                        <tr><td colSpan={5} className="text-center">No trainers yet</td></tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
}
