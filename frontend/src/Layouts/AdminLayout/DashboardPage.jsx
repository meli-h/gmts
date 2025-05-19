import { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, 
  Table, Spinner, Alert 
} from 'react-bootstrap';
import { 
  getTrainerStats, 
  getMembershipDistribution, 
  getInactiveMembers 
} from '../../api';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

export default function DashboardPage() {
  // Register Chart.js components
  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
  );

  const [trainerStats, setTrainerStats] = useState(null);
  const [membershipDistribution, setMembershipDistribution] = useState(null);
  const [inactiveMembers, setInactiveMembers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [trainers, memberships, inactive] = await Promise.all([
          getTrainerStats(),
          getMembershipDistribution(),
          getInactiveMembers()
        ]);
        
        setTrainerStats(trainers);
        setMembershipDistribution(memberships);
        setInactiveMembers(inactive);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  // Prepare membership chart data
  const membershipChartData = {
    labels: membershipDistribution?.map(item => item.membership_type) || [],
    datasets: [
      {
        label: 'Membership Distribution',
        data: membershipDistribution?.map(item => item.member_count) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare trainer stats chart data
  const trainerChartData = {
    labels: trainerStats?.slice(0, 5).map(item => item.trainer) || [],
    datasets: [
      {
        label: 'Total Participants',
        data: trainerStats?.slice(0, 5).map(item => item.total_participants) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Class Count',
        data: trainerStats?.slice(0, 5).map(item => item.class_cnt) || [],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Top 5 Trainers by Participants',
      },
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
      },
    },
  };

  return (
    <Container fluid>
      <h2 className="mb-4">Admin Dashboard</h2>
      
      <Row className="mb-4">
        <Col md={6} lg={4}>
          <Card className="h-100">
            <Card.Header className="bg-primary text-white">
              <h5 className="m-0">Membership Distribution</h5>
            </Card.Header>
            <Card.Body className="d-flex justify-content-center align-items-center">
              <div style={{ height: '250px', width: '100%' }}>
                <Pie data={membershipChartData} />
              </div>
            </Card.Body>
            <Card.Footer>
              <Table striped bordered hover size="sm" className="mb-0">
                <thead>
                  <tr>
                    <th>Membership Type</th>
                    <th>Count</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {membershipDistribution?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.membership_type}</td>
                      <td>{item.member_count}</td>
                      <td>{item.pct_total}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col md={6} lg={8}>
          <Card className="h-100">
            <Card.Header className="bg-success text-white">
              <h5 className="m-0">Trainer Statistics</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '250px', width: '100%' }}>
                <Bar data={trainerChartData} options={barOptions} />
              </div>
            </Card.Body>
            <Card.Footer>
              <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                <Table striped bordered hover size="sm" className="mb-0">
                  <thead>
                    <tr>
                      <th>Trainer</th>
                      <th>Classes</th>
                      <th>Total Participants</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainerStats?.map((trainer, index) => (
                      <tr key={index}>
                        <td>{trainer.trainer}</td>
                        <td>{trainer.class_cnt}</td>
                        <td>{trainer.total_participants}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <Card>
            <Card.Header className="bg-warning">
              <h5 className="m-0">Inactive Members (No Bookings)</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <Table striped bordered hover responsive className="mb-0">
                  <thead className="sticky-top bg-light">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Surname</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inactiveMembers?.length > 0 ? (
                      inactiveMembers.map((member, index) => (
                        <tr key={index}>
                          <td>{member.gymMember_id}</td>
                          <td>{member.name}</td>
                          <td>{member.surname}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center">
                          No inactive members found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
            <Card.Footer className="text-end">
              <small className="text-muted">
                Total inactive members: {inactiveMembers?.length || 0}
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
} 