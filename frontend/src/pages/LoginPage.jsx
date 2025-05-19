// frontend/src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import { useAuth } from '../auth/AuthContext.jsx';  // :contentReference[oaicite:10]{index=10}:contentReference[oaicite:11]{index=11}

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [cred, setCred] = useState({ username: '', password: '' });

  const submit = async e => {
    e.preventDefault();
    try {
      const u = await login(cred.username, cred.password);
      // role’a göre yönlendir
      if (u.account_type === 'Administrator') {
        nav('/admin', { replace: true });
      } else if (u.account_type === 'Trainer') {
        // mutlaka parametreli route: trainer/:trainerId/*
        nav(`/trainer/${u.trainer_id}/create-class`, { replace: true });
      } else {
        nav(`/member/${u.member_id}/create-booking`, { replace: true });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg" style={{ minWidth: 320 }}>
        <h4 className="mb-3 text-center">Gym Scheduler Login</h4>
        <Form onSubmit={submit}>
          <Form.Control
            className="mb-2"
            placeholder="Username"
            value={cred.username}
            onChange={e => setCred({ ...cred, username: e.target.value })}
            required
          />
          <Form.Control
            className="mb-3"
            type="password"
            placeholder="Password"
            value={cred.password}
            onChange={e => setCred({ ...cred, password: e.target.value })}
            required
          />
          <Button type="submit" className="w-100">Sign in</Button>
        </Form>
      </Card>
    </div>
  );
}
