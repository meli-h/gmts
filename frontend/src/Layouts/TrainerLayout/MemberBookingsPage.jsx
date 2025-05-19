import { useState, useEffect } from 'react';
import { getBookings, getClasses, getMembers } from '../../api';
import { Table, Spinner, Alert, Form, InputGroup, Button, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export default function MemberBookingsPage() {
  const { trainerId } = useParams();
  const [bookings, setBookings] = useState(null);
  const [members, setMembers] = useState({});
  const [classes, setClasses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [trainerClasses, setTrainerClasses] = useState([]);

  // Fetch all needed data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get classes taught by this trainer
        const allClasses = await getClasses();
        const myClasses = allClasses.filter(cls => cls.trainer_id === +trainerId);
        setTrainerClasses(myClasses);
        
        // Create a lookup map for classes
        const classMap = {};
        myClasses.forEach(cls => {
          classMap[cls.class_id] = cls;
        });
        setClasses(classMap);
        
        // Get all bookings
        const allBookings = await getBookings();
        
        // Filter bookings for classes taught by this trainer
        const myClassIds = myClasses.map(cls => cls.class_id);
        const relevantBookings = allBookings.filter(booking => 
          myClassIds.includes(booking.class_id)
        );
        setBookings(relevantBookings);
        
        // Get all members for lookup
        const allMembers = await getMembers();
        const memberMap = {};
        allMembers.forEach(member => {
          memberMap[member.gymMember_id] = member;
        });
        setMembers(memberMap);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchData();
  }, [trainerId]);

  // Filter bookings based on search term and selected class
  useEffect(() => {
    if (!bookings) return;
    
    let filtered = [...bookings];
    
    // Filter by selected class
    if (selectedClass !== 'all') {
      filtered = filtered.filter(booking => booking.class_id === +selectedClass);
    }
    
    // Filter by search term (name or surname)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(booking => {
        const member = members[booking.gymMember_id];
        if (!member) return false;
        
        return (
          member.name?.toLowerCase().includes(term) || 
          member.surname?.toLowerCase().includes(term)
        );
      });
    }
    
    // Sort by class start time
    filtered.sort((a, b) => {
      const classA = classes[a.class_id];
      const classB = classes[b.class_id];
      if (!classA || !classB) return 0;
      
      return new Date(classA.start_time) - new Date(classB.start_time);
    });
    
    setFilteredBookings(filtered);
  }, [bookings, searchTerm, selectedClass, members, classes]);

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }
  
  if (loading) {
    return <Spinner className="m-5" animation="border" />;
  }

  return (
    <div className="p-4">
      <h2 className="mb-4">Members Booked for Your Classes</h2>
      
      <Row className="mb-4">
        <Col md={6}>
          {/* Search bar */}
          <Form.Group>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search members by name or surname..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button 
                  variant="outline-secondary"
                  onClick={() => setSearchTerm('')}
                >
                  Clear
                </Button>
              )}
            </InputGroup>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          {/* Class filter */}
          <Form.Group>
            <Form.Select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="all">All Classes</option>
              {trainerClasses.map(cls => (
                <option key={cls.class_id} value={cls.class_id}>
                  {cls.title} - {new Date(cls.start_time).toLocaleString()}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Member Name</th>
            <th>Contact Number</th>
            <th>Class</th>
            <th>Date & Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">
                {searchTerm || selectedClass !== 'all' 
                  ? 'No bookings match your search criteria' 
                  : 'No bookings found for your classes'}
              </td>
            </tr>
          ) : (
            filteredBookings.map(booking => {
              const member = members[booking.gymMember_id] || {};
              const classInfo = classes[booking.class_id] || {};
              
              return (
                <tr key={booking.booking_id}>
                  <td>{booking.booking_id}</td>
                  <td>{member.name} {member.surname}</td>
                  <td>{member.contactNumber || 'N/A'}</td>
                  <td>{classInfo.title || `Class #${booking.class_id}`}</td>
                  <td>{classInfo.start_time 
                    ? new Date(classInfo.start_time).toLocaleString() 
                    : booking.start_time?.replace('T', ' ').slice(0, 16)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
} 