import { useEffect, useState } from 'react';
import { getClasses, deleteClass, updateClass } from '../../api';
import { Table, Button, Spinner, Alert, Modal, Form, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export default function ClassListPage() {
  const { trainerId } = useParams();
  const [list, setList] = useState(null);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    start_time: '',
    duration: '',
    capacity: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleEdit = (classItem) => {
    setCurrentClass(classItem);
    // Format the datetime for the HTML datetime-local input
    const startTimeFormatted = classItem.start_time 
      ? classItem.start_time.replace(' ', 'T').substring(0, 16) 
      : '';
    
    setFormData({
      title: classItem.title,
      start_time: startTimeFormatted,
      duration: classItem.duration,
      capacity: classItem.capacity
    });
    setShowEditModal(true);
    setErrorMessage('');
  };

  const handleUpdate = async () => {
    try {
      // Clear any previous error
      setErrorMessage('');
      
      // Make a copy of form data to avoid directly modifying state
      const formDataToSend = { ...formData };
      
      // Ensure the start_time is in the correct format for MySQL
      if (formDataToSend.start_time) {
        // Convert from datetime-local format to MySQL datetime format
        // Input: "2026-08-12T01:12" -> Output: "2026-08-12 01:12:00"
        formDataToSend.start_time = formDataToSend.start_time.replace('T', ' ') + ':00';
      }
      
      await updateClass(currentClass.class_id, formDataToSend);
      setShowEditModal(false);
      refresh();
    } catch (err) {
      console.error('Error updating class:', err);
      if (err.message && err.message.includes('Trainer schedule conflict')) {
        setErrorMessage('This time conflicts with another class. Please choose a different time.');
      } else {
        setErrorMessage(`${err.message}`);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setShowEditModal(false);
    setErrorMessage('');
  };

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
            <th>Actions</th>
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
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleEdit(c)}
                  >
                    Edit
                  </Button>
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
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Class Modal */}
      <Modal show={showEditModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentClass && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Start Date and Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                />
                <Form.Text className="text-muted">
                  Changing the start time might affect existing bookings
                </Form.Text>
              </Form.Group>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Duration (minutes)</Form.Label>
                    <Form.Control
                      type="number"
                      name="duration"
                      min={1}
                      max={240}
                      value={formData.duration}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Capacity</Form.Label>
                    <Form.Control
                      type="number"
                      name="capacity"
                      min={1}
                      max={100}
                      value={formData.capacity}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              {errorMessage && (
                <Alert variant="danger">{errorMessage}</Alert>
              )}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
