import { useState } from 'react';
import { addClass } from '../../api';
import { Form, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

export default function CreateClassPage() {
  const { trainerId } = useParams();
  const navigate      = useNavigate();

  const [cls, setCls] = useState({
    title: '',
    start_time: '',
    duration: '',
    capacity: ''
  });
  const [msg, setMsg] = useState(null);

  const update = key => e => {
    setCls(prev => ({ ...prev, [key]: e.target.value }));
  };

  const submit = async e => {
    e.preventDefault();
    setMsg(null);
    try {
      await addClass({
        trainer_id:  +trainerId,
        title:       cls.title,
        start_time:  cls.start_time,
        duration:    +cls.duration,
        capacity:    +cls.capacity
      });
      setMsg({ variant: 'success', txt: 'Class created!' });
      setCls({ title: '', start_time: '', duration: '', capacity: '' });
      navigate('../class-list');
    } catch (err) {
      setMsg({ variant: 'danger', txt: err.message });
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Create Class</h2>

      {msg && <Alert variant={msg.variant}>{msg.txt}</Alert>}

      <Form onSubmit={submit}>
        <Row className="g-3">
          <Col md={3}>
            <Form.Control
              placeholder="Title"
              value={cls.title}
              onChange={update('title')}
              required
            />
          </Col>

          <Col md={3}>
            <Form.Control
              type="datetime-local"
              value={cls.start_time}
              onChange={update('start_time')}
              required
            />
          </Col>

          <Col md={2}>
            <Form.Control
              type="number"
              min={1}
              max={240}
              placeholder="Duration (min)"
              value={cls.duration}
              onChange={update('duration')}
              required
            />
          </Col>

          <Col md={2}>
            <Form.Control
              type="number"
              min={1}
              max={100}
              placeholder="Capacity"
              value={cls.capacity}
              onChange={update('capacity')}
              required
            />
          </Col>

          <Col xs={12}>
            <Button type="submit">Create</Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
