// src/Layouts/GymMemberLayout/CreateBookingPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { getClasses, getBookings, addBooking } from '../../api';
import {
  Form,
  Button,
  Table,
  Spinner,
  Pagination,
  Alert,
  InputGroup
} from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const PAGE_SIZE = 10;

export default function CreateBookingPage() {
  const { memberId } = useParams();
  const MEMBER_ID = +memberId;

  const [classes, setClasses] = useState(null);
  const [already, setAlready] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    getClasses()
      .then(classes => {
        // Additional client-side filter for expired classes
        const now = new Date();
        const validClasses = classes.filter(cls => {
          const classTime = new Date(cls.start_time);
          return classTime > now;
        });
        setClasses(validClasses);
      })
      .catch(err => setError(err.message));

    getBookings()
      .then(bs => {
        const mine = bs
          .filter(b => b.gymMember_id === MEMBER_ID)
          .map(b => b.class_id);
        setAlready(new Set(mine));
      })
      .catch(err => setError(err.message));
  }, [MEMBER_ID]);

  // Filter classes based on search term and already booked classes
  const filtered = useMemo(() => {
    if (!classes) return [];
    
    return classes
      .filter(c => 
        !already.has(c.class_id) && 
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  }, [classes, searchTerm, already]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const handleAdd = async class_id => {
    if (!window.confirm(`Book class #${class_id}?`)) return;
    try {
      await addBooking({ class_id, gymMember_id: MEMBER_ID });
      alert('Booking created!');
      setAlready(prev => new Set(prev).add(class_id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!classes) return <Spinner animation="border" className="m-5" />;

  return (
    <>
      <h2 className="mb-4">Create Booking</h2>

      {/* Search bar */}
      <Form className="mb-4">
        <InputGroup>
          <Form.Control
            placeholder="Search by class name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
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
      </Form>

      {/* Classes table */}
      <Table
        striped
        bordered
        hover
        responsive
        className="mb-4 w-100"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Class Name</th>
            <th>Trainer</th>
            <th>Start Time</th>
            <th>Duration</th>
            <th>Capacity</th>
            <th>Enrolled</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {slice.map(c => (
            <tr key={c.class_id}>
              <td>{c.class_id}</td>
              <td>{c.title}</td>
              <td>{c.trainer}</td>
              <td>{c.start_time.replace('T',' ').slice(0,16)}</td>
              <td>{c.duration} min</td>
              <td>{c.capacity}</td>
              <td>{c.enrolled}</td>
              <td>
                <Button 
                  size="sm" 
                  onClick={() => handleAdd(c.class_id)}
                  disabled={c.enrolled >= c.capacity}
                >
                  {c.enrolled >= c.capacity ? 'Full' : 'Book'}
                </Button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center">
                {searchTerm 
                  ? `No classes found matching "${searchTerm}"` 
                  : 'No available classes'}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* pagination with ellipsis for large numbers */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center">
          <Pagination.First onClick={() => setPage(1)} disabled={page === 1} />
          <Pagination.Prev
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          />
          
          {totalPages <= 7 ? (
            // Show all pages if 7 or fewer
            [...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i+1}
                active={page === i+1}
                onClick={() => setPage(i+1)}
              >
                {i+1}
              </Pagination.Item>
            ))
          ) : (
            // Show limited pages with ellipsis for many pages
            <>
              {page > 2 && <Pagination.Item onClick={() => setPage(1)}>1</Pagination.Item>}
              {page > 3 && <Pagination.Ellipsis />}
              
              {page > 1 && <Pagination.Item onClick={() => setPage(page-1)}>{page-1}</Pagination.Item>}
              <Pagination.Item active>{page}</Pagination.Item>
              {page < totalPages && <Pagination.Item onClick={() => setPage(page+1)}>{page+1}</Pagination.Item>}
              
              {page < totalPages - 2 && <Pagination.Ellipsis />}
              {page < totalPages - 1 && <Pagination.Item onClick={() => setPage(totalPages)}>{totalPages}</Pagination.Item>}
            </>
          )}
          
          <Pagination.Next
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          />
          <Pagination.Last onClick={() => setPage(totalPages)} disabled={page === totalPages} />
        </Pagination>
      )}
    </>
  );
}
