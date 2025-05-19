import { useEffect, useState } from 'react';
import { getMembers, deleteMember, updateMember } from '../../api';
import { Table, Button, Spinner, Pagination, Modal, Form, Row, Col, InputGroup } from 'react-bootstrap';

const PAGE_SIZE = 10;

export default function GymMemberListPage() {
    const [members, setMembers] = useState(null);
    const [page, setPage] = useState(1);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentMember, setCurrentMember] = useState(null);
    const [formData, setFormData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMembers, setFilteredMembers] = useState([]);

    /* ---- fetch helpers ---- */
    const fetchList = async () => {
        const data = await getMembers();
        setMembers(data);
        setFilteredMembers(data);
    };

    /* ---- initial load ---- */
    useEffect(() => { fetchList(); }, []);

    /* ---- search filter ---- */
    useEffect(() => {
        if (!members) return;
        
        if (!searchTerm.trim()) {
            setFilteredMembers(members);
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = members.filter(member => 
                member.name?.toLowerCase().includes(term) || 
                member.surname?.toLowerCase().includes(term)
            );
            setFilteredMembers(filtered);
        }
        // Reset to first page when search changes
        setPage(1);
    }, [searchTerm, members]);

    /* ---- delete with confirm ---- */
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this member?')) return;
        await deleteMember(id);
        fetchList();
    };

    /* ---- open edit modal ---- */
    const handleEdit = (member) => {
        setCurrentMember(member);
        setFormData({
            name: member.name,
            surname: member.surname,
            contactNumber: member.contactNumber,
            DateOfBirth: member.DateOfBirth?.slice(0, 10) || '',
            Gender: member.Gender,
            membership_type: member.membership_type,
            member_start_date: member.member_start_date?.slice(0, 10) || '',
            member_end_date: member.member_end_date?.slice(0, 10) || ''
        });
        setShowEditModal(true);
    };

    /* ---- update member ---- */
    const handleUpdate = async () => {
        try {
            await updateMember(currentMember.gymMember_id, formData);
            setShowEditModal(false);
            fetchList();
            alert('Member updated successfully');
        } catch (error) {
            console.error('Failed to update member:', error);
            alert('Failed to update member');
        }
    };

    /* ---- handle form changes ---- */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /* ---- loading spinner ---- */
    if (!members) return <Spinner className="m-5" animation="border" />;

    /* ---- pagination math ---- */
    const totalPages = Math.ceil(filteredMembers.length / PAGE_SIZE) || 1;
    const slice = filteredMembers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    /* ---- keep page in bounds (ör. son satırı silince) ---- */
    if (page > totalPages) setPage(totalPages);

    /* ---- pagination items ---- */
    // Limit the number of page items to show (e.g., show at most 5)
    const MAX_PAGES_TO_SHOW = 5;
    const startPage = Math.max(1, Math.min(page - Math.floor(MAX_PAGES_TO_SHOW / 2), totalPages - MAX_PAGES_TO_SHOW + 1));
    const endPage = Math.min(startPage + MAX_PAGES_TO_SHOW - 1, totalPages);
    
    const pages = [];
    if (startPage > 1) {
        pages.push(
            <Pagination.Item key={1} onClick={() => setPage(1)}>1</Pagination.Item>,
            <Pagination.Ellipsis key="start-ellipsis" disabled />
        );
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pages.push(
            <Pagination.Item key={i} active={page === i} onClick={() => setPage(i)}>
                {i}
            </Pagination.Item>
        );
    }
    
    if (endPage < totalPages) {
        pages.push(
            <Pagination.Ellipsis key="end-ellipsis" disabled />,
            <Pagination.Item key={totalPages} onClick={() => setPage(totalPages)}>{totalPages}</Pagination.Item>
        );
    }

    return (
        <div>
            <h2 className="mb-4">Gym Member List</h2>
            
            {/* Search Bar */}
            <div className="mb-4">
                <Form.Group>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Search by name or surname..."
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
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#ID</th><th>Name</th><th>Surname</th>
                        <th>Membership</th><th>Start</th><th>End</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {slice.map(m => (
                        <tr key={m.gymMember_id}>
                            <td>{m.gymMember_id}</td>
                            <td>{m.name}</td>
                            <td>{m.surname}</td>
                            <td>{m.membership_type}</td>
                            <td>{m.member_start_date?.slice(0, 10) ?? '-'}</td>
                            <td>{m.member_end_date?.slice(0, 10) ?? '-'}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <Button size="sm" variant="primary" onClick={() => handleEdit(m)}>
                                        Edit
                                    </Button>
                                    <Button size="sm" variant="danger" onClick={() => handleDelete(m.gymMember_id)}>
                                        Delete
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredMembers.length === 0 &&
                        <tr><td colSpan={7} className="text-center">No members found</td></tr>}
                </tbody>
            </Table>

            {totalPages > 1 && (
                <Pagination>
                    <Pagination.First onClick={() => setPage(1)} disabled={page === 1} />
                    <Pagination.Prev onClick={() => page > 1 && setPage(page - 1)} disabled={page === 1} />
                    {pages}
                    <Pagination.Next onClick={() => page < totalPages && setPage(page + 1)} disabled={page === totalPages} />
                    <Pagination.Last onClick={() => setPage(totalPages)} disabled={page === totalPages} />
                </Pagination>
            )}

            {/* Edit Member Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentMember && (
                        <Form>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="name" 
                                            value={formData.name || ''} 
                                            onChange={handleChange} 
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Surname</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="surname" 
                                            value={formData.surname || ''} 
                                            onChange={handleChange} 
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Contact Number</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="contactNumber" 
                                            value={formData.contactNumber || ''} 
                                            onChange={handleChange} 
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Date of Birth</Form.Label>
                                        <Form.Control 
                                            type="date" 
                                            name="DateOfBirth" 
                                            value={formData.DateOfBirth || ''} 
                                            onChange={handleChange} 
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Gender</Form.Label>
                                        <Form.Select 
                                            name="Gender" 
                                            value={formData.Gender || ''} 
                                            onChange={handleChange}
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={8}>
                                    <Form.Group>
                                        <Form.Label>Membership Type</Form.Label>
                                        <Form.Select 
                                            name="membership_type" 
                                            value={formData.membership_type || ''} 
                                            onChange={handleChange}
                                        >
                                            <option value="Monthly">Monthly</option>
                                            <option value="Quarterly">Quarterly</option>
                                            <option value="Yearly">Yearly</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Start Date</Form.Label>
                                        <Form.Control 
                                            type="date" 
                                            name="member_start_date" 
                                            value={formData.member_start_date || ''} 
                                            onChange={handleChange} 
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>End Date</Form.Label>
                                        <Form.Control 
                                            type="date" 
                                            name="member_end_date" 
                                            value={formData.member_end_date || ''} 
                                            onChange={handleChange} 
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
