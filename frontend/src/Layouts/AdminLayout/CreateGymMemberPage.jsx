// src/Layouts/AdminLayout/CreateGymMemberPage.jsx
import { useState } from 'react';
import { addMember } from '../../api';
import { Form, Button } from 'react-bootstrap';

const ENDPOINT = {
    trainers: '/api/trainers',
    members: '/api/gym-members',   // <-- /api/gym-members DEĞİL!
};



export default function CreateGymMemberPage() {
    const [member, setMember] = useState({
        name: '',
        surname: '',
        account_id: '',
        membership_type: 'Monthly'
    });

    const submit = async (e) => {
        e.preventDefault();
        await addMember({
            ...member,
            account_id: +member.account_id,    // number cast
        });
        alert('Member created!');
        setMember({ name: '', surname: '', account_id: '', membership_type: 'Monthly' });
    };

    return (
        <div>
            <h2 className="mb-4">Create Gym Member</h2>
            <Form onSubmit={submit} className="row g-3">

                <Form.Group className="col-md-4">
                    <Form.Control
                        placeholder="Name"
                        value={member.name}
                        onChange={(e) => setMember({ ...member, name: e.target.value })}
                        required
                    />
                </Form.Group>

                <Form.Group className="col-md-4">
                    <Form.Control
                        placeholder="Surname"
                        value={member.surname}
                        onChange={(e) => setMember({ ...member, surname: e.target.value })}
                        required
                    />
                </Form.Group>

                <Form.Group className="col-md-4">
                    <Form.Control
                        type="number"
                        placeholder="Account ID"
                        value={member.account_id}
                        onChange={(e) => setMember({ ...member, account_id: e.target.value })}
                        required
                    />
                </Form.Group>

                <Form.Group className="col-md-4">
                    <Form.Select
                        value={member.membership_type}
                        onChange={(e) => setMember({ ...member, membership_type: e.target.value })}
                    >
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Yearly">Yearly</option>
                    </Form.Select>
                </Form.Group>

                <div className="col-12">
                    <Button type="submit">Create</Button>
                </div>
            </Form>
        </div>
    );
}
