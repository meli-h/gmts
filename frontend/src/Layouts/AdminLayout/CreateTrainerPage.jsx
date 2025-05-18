import { useState } from 'react';
import { addTrainer } from '../../api';   // api.js yoluna göre güncelle

import { Form, Row, Col, Button } from 'react-bootstrap';

const ENDPOINT = {
    trainers: '/api/trainers',
    members: '/api/gym-members',   // <-- /api/gym-members DEĞİL!
};


export default function CreateTrainerPage() {
    const [t, setT] = useState({
        name: '', surname: '', contactNumber: '',
        DateOfBirth: '', Gender: 'Male',
        username: '', password: ''
    });

    const update = (k) => (e) => setT({ ...t, [k]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        await addTrainer({
            name: t.name,
            surname: t.surname,
            contactNumber: t.contactNumber,
            DateOfBirth: t.DateOfBirth,
            Gender: t.Gender,
            username: t.username,
            password: t.password
        });
        alert('Trainer created!');
        setT({ name: '', surname: '', contactNumber: '', DateOfBirth: '', Gender: 'Male', username: '', password: '' });
    };

    return (
        <div>
            <h2 className="mb-4">Create Trainer</h2>

            <Form onSubmit={submit}>
                <Row className="g-3">
                    <Col md={3}><Form.Control placeholder="Name" value={t.name} onChange={update('name')} required /></Col>
                    <Col md={3}><Form.Control placeholder="Surname" value={t.surname} onChange={update('surname')} required /></Col>
                    <Col md={3}><Form.Control placeholder="Contact Number" value={t.contactNumber} onChange={update('contactNumber')} required /></Col>
                    <Col md={3}><Form.Control type="date" value={t.DateOfBirth} onChange={update('DateOfBirth')} required /></Col>

                    <Col md={3}>
                        <Form.Select value={t.Gender} onChange={update('Gender')}>
                            <option>Male</option><option>Female</option><option>Other</option>
                        </Form.Select>
                    </Col>

                    <Col md={3}><Form.Control placeholder="Username" value={t.username} onChange={update('username')} required /></Col>
                    <Col md={3}><Form.Control type="password" placeholder="Password" value={t.password} onChange={update('password')} required /></Col>

                    <Col xs={12}><Button type="submit">Create</Button></Col>
                </Row>
            </Form>
        </div>
    );
}