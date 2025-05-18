import { useState, useEffect } from 'react';
import { addClass, getTrainers } from '../../api';
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap';

export default function CreateClassPage() {
    const [trainers, setTrainers] = useState(null);      // dropdown veri
    const [cls, setCls] = useState({
        trainer_id: '', title: '', start_time: '',
        duration: '', capacity: ''
    });

    /* ---- Trainer listesini çek ---- */
    useEffect(() => { getTrainers().then(setTrainers); }, []);

    const update = key => e => setCls({ ...cls, [key]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        await addClass({ ...cls, trainer_id: +cls.trainer_id });
        alert('Class created!');
        setCls({ trainer_id: '', title: '', start_time: '', duration: '', capacity: '' });
    };

    if (!trainers) return <Spinner className="m-5" animation="border" />;

    return (
        <div>
            <h2 className="mb-4">Create Class</h2>

            <Form onSubmit={submit}>
                <Row className="g-3">

                    <Col md={3}>
                        <Form.Select value={cls.trainer_id} onChange={update('trainer_id')} required>
                            <option value="">— Select Trainer —</option>
                            {trainers.map(t => (
                                <option key={t.trainer_id} value={t.trainer_id}>
                                    {t.trainer_id} – {t.name} {t.surname}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>

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

                    <Col md={3}>
                        <Form.Control
                            type="number" min={1} max={240}
                            placeholder="Duration (min)"
                            value={cls.duration}
                            onChange={update('duration')}
                            required
                        />
                    </Col>

                    <Col md={3}>
                        <Form.Control
                            type="number" min={1} max={100}
                            placeholder="Capacity"
                            value={cls.capacity}
                            onChange={update('capacity')}
                            required
                        />
                    </Col>

                    <Col xs={12}><Button type="submit">Create</Button></Col>
                </Row>
            </Form>
        </div>
    );
}
