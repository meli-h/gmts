import { useEffect, useState } from 'react';
import { getClasses, deleteClass } from '../../api';
import { Table, Button, Spinner, Pagination } from 'react-bootstrap';

const PAGE_SIZE = 10;

export default function ClassListPage() {
    const [classes, setClasses] = useState(null);
    const [page, setPage] = useState(1);

    const refresh = async () => setClasses(await getClasses());

    useEffect(() => { refresh(); }, []);

    /* ---------- silme ---------- */
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this class?')) return;
        await deleteClass(id);
        refresh();
    };

    if (!classes) return <Spinner className="m-5" animation="border" />;

    /* ---------- pagination ---------- */
    const totalPages = Math.ceil(classes.length / PAGE_SIZE);
    const slice = classes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const items = [];
    for (let p = 1; p <= totalPages; p++) {
        items.push(
            <Pagination.Item key={p} active={p === page} onClick={() => setPage(p)}>
                {p}
            </Pagination.Item>
        );
    }

    return (
        <div>
            <h2 className="mb-4">Class List</h2>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th><th>Title</th><th>Start</th>
                        <th>Duration</th><th>Capacity</th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {slice.map(c => (
                        <tr key={c.class_id}>
                            <td>{c.class_id}</td>
                            <td>{c.title}</td>
                            <td>{c.start_time?.replace('T', ' ').slice(0, 16)}</td>
                            <td>{c.duration}</td>
                            <td>{c.capacity}</td>
                            <td>
                                <Button
                                    size="sm" variant="danger"
                                    onClick={() => handleDelete(c.class_id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {classes.length === 0 &&
                        <tr><td colSpan={6} className="text-center">No classes yet</td></tr>}
                </tbody>
            </Table>

            {totalPages > 1 && (
                <Pagination>
                    {items}
                    <Pagination.Next
                        onClick={() => page < totalPages && setPage(page + 1)}
                        disabled={page === totalPages}
                    />
                </Pagination>
            )}
        </div>
    );
}
