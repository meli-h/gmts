import { useEffect, useState } from 'react';
import { getClasses, deleteClass } from '../../api';
import { Table, Button, Spinner } from 'react-bootstrap';

export default function ClassListPage() {
    const [list, setList] = useState(null);
    const refresh = async () => setList(await getClasses());

    useEffect(() => { refresh(); }, []);

    if (!list) return <Spinner className="m-5" animation="border" />;

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
                    {list.map(c => (
                        <tr key={c.class_id}>
                            <td>{c.class_id}</td>
                            <td>{c.title}</td>
                            <td>{c.start_time?.replace('T', ' ')}</td>
                            <td>{c.duration}</td>
                            <td>{c.capacity}</td>
                            <td>
                                <Button size="sm" variant="danger"
                                    onClick={async () => { await deleteClass(c.class_id); refresh(); }}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {list.length === 0 &&
                        <tr><td colSpan={6} className="text-center">No classes yet</td></tr>}
                </tbody>
            </Table>
        </div>
    );
}
