import { useEffect, useState } from 'react';
import { getClasses, deleteClass } from '../../api';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export default function ClassListPage() {
  const { trainerId } = useParams();
  const [list, setList]   = useState(null);
  const [error, setError] = useState(null);

  const refresh = async () => {
    try {
      const all = await getClasses();
      const mine = all.filter(c => c.trainer_id === +trainerId);
      setList(mine);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    refresh();
  }, [trainerId]);

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }
  if (list === null) {
    return <Spinner className="m-5" animation="border" />;
  }

  return (
    <div className="p-4">
      <h2 className="mb-4">Class List</h2>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Start</th>
            <th>Duration</th>
            <th>Capacity</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center">
                No classes yet
              </td>
            </tr>
          )}
          {list.map(c => (
            <tr key={c.class_id}>
              <td>{c.class_id}</td>
              <td>{c.title}</td>
              <td>{c.start_time.replace('T', ' ')}</td>
              <td>{c.duration}</td>
              <td>{c.capacity}</td>
              <td>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={async () => {
                    await deleteClass(c.class_id);
                    refresh();
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
