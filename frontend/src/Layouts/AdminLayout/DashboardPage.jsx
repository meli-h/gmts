import { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, 
  Table, Spinner, Alert, Badge
} from 'react-bootstrap';
import { 
  getTrainerStats, 
  getMembershipDistribution, 
  getInactiveMembers,
  getClassPopularity,
  getMemberEngagement
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
  const [classPopularity, setClassPopularity] = useState(null);
  const [memberEngagement, setMemberEngagement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [trainers, memberships, inactive, classes, engagement] = await Promise.all([
          getTrainerStats(),
          getMembershipDistribution(),
          getInactiveMembers(),
          getClassPopularity(),
          getMemberEngagement()
        ]);
        
        setTrainerStats(trainers);
        setMembershipDistribution(memberships);
        setInactiveMembers(inactive);
        setClassPopularity(classes);
        setMemberEngagement(engagement);
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

  // Prepare class popularity chart data
  const classPopularityData = {
    labels: Array.isArray(classPopularity) ? classPopularity.map(item => item.class_name) : [],
    datasets: [
      {
        label: 'Booking Count',
        data: Array.isArray(classPopularity) ? classPopularity.map(item => item.booking_count) : [],
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
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

  const classBarOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Most Popular Classes',
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
      
      {/* Class Popularity Analysis */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-info text-white">
              <h5 className="m-0">Class Popularity Analysis</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '250px', width: '100%' }}>
                {Array.isArray(classPopularity) && classPopularity.length > 0 ? (
                  <Bar data={classPopularityData} options={classBarOptions} />
                ) : (
                  <div className="text-center p-5">
                    <p>No class popularity data available</p>
                  </div>
                )}
              </div>
            </Card.Body>
            <Card.Footer>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <Table striped bordered hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Class Name</th>
                      <th>Day</th>
                      <th>Time</th>
                      <th>Trainer</th>
                      <th>Bookings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(classPopularity) && classPopularity.length > 0 ? (
                      classPopularity.map((classItem, index) => (
                        <tr key={index}>
                          <td>{classItem.class_name}</td>
                          <td>{classItem.day_of_week}</td>
                          <td>{classItem.start_time}</td>
                          <td>{classItem.trainer_name}</td>
                          <td>
                            <Badge bg="info" pill>
                              {classItem.booking_count}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center">
                          No class popularity data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {/* Member Engagement */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h5 className="m-0">Member Engagement Metrics</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <Table striped bordered hover responsive className="mb-0">
                  <thead className="sticky-top bg-light">
                    <tr>
                      <th>Member</th>
                      <th>Membership Type</th>
                      <th>Total Bookings</th>
                      <th>Unique Days</th>
                      <th>Last Booking</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(memberEngagement) && memberEngagement.length > 0 ? (
                      memberEngagement.map((member, index) => (
                        <tr key={index}>
                          <td>{member.member_name}</td>
                          <td>{member.membership_type}</td>
                          <td>
                            <Badge bg="primary" pill>
                              {member.total_bookings}
                            </Badge>
                          </td>
                          <td>{member.unique_days}</td>
                          <td>{member.last_booking ? new Date(member.last_booking).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center">
                          No member engagement data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
            <Card.Footer className="text-end">
              <small className="text-muted">
                Showing top {Array.isArray(memberEngagement) ? memberEngagement.length : 0} active members
              </small>
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