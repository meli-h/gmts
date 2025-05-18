// src/Layouts/AdminLayout/CreateGymMemberPage.jsx
import { useState } from 'react';
import { addMember } from '../../api';
import { Form, Row, Col, Button } from 'react-bootstrap';

export default function CreateGymMemberPage() {
  const [m, setM] = useState({
    name: '',
    surname: '',
    contactNumber: '',
    dob: '',              // DateOfBirth’a map edilecek
    gender: 'Male',
    membershipType: 'Monthly',
    username: '',
    password: ''
  });

  const update = (key) => (e) => {
    setM(prev => ({ ...prev, [key]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    await addMember({
      name:           m.name,
      surname:        m.surname,
      contactNumber:  m.contactNumber,
      DateOfBirth:    m.dob,
      Gender:         m.gender,
      membershipType: m.membershipType,
      username:       m.username,
      password:       m.password
    });
    alert('Member created!');
    setM({
      name: '',
      surname: '',
      contactNumber: '',
      dob: '',
      gender: 'Male',
      membershipType: 'Monthly',
      username: '',
      password: ''
    });
  };

  return (
    <div>
      <h2 className="mb-4">Create Gym Member</h2>
      <Form onSubmit={submit}>
        <Row className="g-3">
          <Col md={4}>
            <Form.Control
              placeholder="Name"
              value={m.name}
              onChange={update('name')}
              required
            />
          </Col>
          <Col md={4}>
            <Form.Control
              placeholder="Surname"
              value={m.surname}
              onChange={update('surname')}
              required
            />
          </Col>
          <Col md={4}>
            <Form.Control
              placeholder="Contact Number"
              value={m.contactNumber}
              onChange={update('contactNumber')}
              required
            />
          </Col>

          <Col md={4}>
            <Form.Control
              type="date"
              placeholder="Date of Birth"
              value={m.dob}
              onChange={update('dob')}
              required
            />
          </Col>
          <Col md={4}>
            <Form.Select
              value={m.gender}
              onChange={update('gender')}
              required
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </Form.Select>
          </Col>

          <Col md={4}>
            <Form.Select
              value={m.membershipType}
              onChange={update('membershipType')}
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </Form.Select>
          </Col>

          <Col md={4}>
            <Form.Control
              placeholder="Username"
              value={m.username}
              onChange={update('username')}
              required
            />
          </Col>
          <Col md={4}>
            <Form.Control
              type="password"
              placeholder="Password"
              value={m.password}
              onChange={update('password')}
              required
            />
          </Col>

          <Col xs={12}>
            <Button type="submit">Create Member</Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
