import { useState, useEffect } from 'react';
import { getBookings, deleteBooking } from '../../api';
import { Table, Button, Spinner, Pagination } from 'react-bootstrap';

const PAGE_SIZE = 10;
const MEMBER_ID = 1;          // auth eklenince değişecek

export default function BookingListPage() {
    const [bookings, setBookings] = useState(null);
    const [page, setPage] = useState(1);

    const fetchList = async () =>
        setBookings((await getBookings()).filter(b => b.gymMember_id === MEMBER_ID));

    useEffect(() => { fetchList(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Cancel this booking?')) return;
        await deleteBooking(id);
        fetchList();
    };

    if (!bookings) return <Spinner className="m-5" animation="border" />;

    const totalPages = Math.ceil(bookings.length / PAGE_SIZE) || 1;
    if (page > totalPages) setPage(totalPages);
    const slice = bookings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div>
            <h2 className="mb-4">Booking List</h2>

            <Table striped bordered hover>
                <thead>
                    <tr><th>ID</th><th>Class</th><th>Start</th><th></th></tr>
                </thead>
                <tbody>
                    {slice.map(b => (
                        <tr key={b.booking_id}>
                            <td>{b.booking_id}</td>
                            <td>{b.title ?? b.class_id}</td>
                            <td>{b.start_time?.replace('T', ' ').slice(0, 16)}</td>
                            <td>
                                <Button size="sm" variant="danger" onClick={() => handleDelete(b.booking_id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {bookings.length === 0 &&
                        <tr><td colSpan={4} className="text-center">No bookings yet</td></tr>}
                </tbody>
            </Table>

            {totalPages > 1 && (
                <Pagination>
                    <Pagination.Prev disabled={page === 1} onClick={() => setPage(p => p - 1)} />
                    {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item key={i + 1} active={page === i + 1} onClick={() => setPage(i + 1)}>
                            {i + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next disabled={page === totalPages} onClick={() => setPage(p => p + 1)} />
                </Pagination>
            )}
        </div>
    );
}
