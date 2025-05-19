import { useState, useEffect, useMemo } from 'react';
import { getClasses, addBooking } from '../../api';
import { Form, Row, Col, Button, Table, Spinner, Pagination } from 'react-bootstrap';

const PAGE_SIZE = 10;
const MEMBER_ID = 1;        // → auth gelince token’dan okuyacaksın

export default function CreateBookingPage() {
    const [classes, setClasses] = useState(null);
    const [title, setTitle] = useState('');
    const [page, setPage] = useState(1);

    /* ---- tüm class’ları getir ---- */
    useEffect(() => { getClasses().then(setClasses); }, []);

    /* ---- dropdown başlıkları ---- */
    const titles = useMemo(() =>
        classes ? Array.from(new Set(classes.map(c => c.title))) : [], [classes]);

    /* ---- filtrelenmiş liste ---- */
    const filtered = useMemo(() =>
        !title ? [] : classes.filter(c => c.title === title), [classes, title]);

    /* ---- pagination ---- */
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
    const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    /* ---- booking ekle ---- */
    const handleAdd = async (class_id) => {
        if (!window.confirm(`Book class #${class_id}?`)) return;
        try {
            await addBooking({ class_id, gymMember_id: MEMBER_ID });
            alert('Booking created!');
        } catch (err) {
            alert(err.message);
        }
    };

    if (!classes) return <Spinner className="m-5" animation="border" />;

    return (
        <div>
            <h2 className="mb-4">Create Booking</h2>

            {/* Başlık seçimi */}
            <Form className="mb-4">
                <Row className="g-3">
                    <Col md={4}>
                        <Form.Select value={title} onChange={e => { setTitle(e.target.value); setPage(1); }}>
                            <option value="">— Select Class Title —</option>
                            {titles.map(t => <option key={t} value={t}>{t}</option>)}
                        </Form.Select>
                    </Col>
                </Row>
            </Form>

            {title && (
                <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th><th>Trainer</th><th>Start</th>
                                <th>Cap.</th><th>Booked</th><th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {slice.map(c => (
                                <tr key={c.class_id}>
                                    <td>{c.class_id}</td>
                                    <td>{c.trainer}</td>
                                    <td>{c.start_time.replace('T', ' ').slice(0, 16)}</td>
                                    <td>{c.capacity}</td>
                                    <td>{c.enrolled}</td>
                                    <td>
                                        <Button size="sm" onClick={() => handleAdd(c.class_id)}>
                                            Add Booking
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 &&
                                <tr><td colSpan={6} className="text-center">No classes found</td></tr>}
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
                </>
            )}
        </div>
    );
}
