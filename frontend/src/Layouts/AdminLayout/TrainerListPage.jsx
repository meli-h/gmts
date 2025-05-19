import { useEffect, useState } from 'react';
import { getTrainers, deleteTrainer, updateTrainer } from '../../api';
import { Table, Button, Spinner, Alert, Pagination, Form, InputGroup, Modal, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 10;

export default function TrainerListPage() {
    const [trainers, setTrainers] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentTrainer, setCurrentTrainer] = useState(null);
    const [formData, setFormData] = useState({});

    const fetchList = async () => {
        try {
            setLoading(true);
            const data = await getTrainers();
            console.log("Trainers fetched:", data); // Debug log
            setTrainers(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching trainers:", err);
            setError("Failed to load trainers. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchList(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this trainer?')) return;
        try {
            await deleteTrainer(id);
            fetchList();
        } catch (err) {
            alert("Failed to delete trainer");
        }
    };

    const handleEdit = (trainer) => {
        setCurrentTrainer(trainer);
        setFormData({
            name: trainer.name,
            surname: trainer.surname,
            contactNumber: trainer.contactNumber || '',
            DateOfBirth: trainer.DateOfBirth?.slice(0, 10) || '',
            Gender: trainer.Gender || 'Male'
        });
        setShowEditModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = async () => {
        try {
            await updateTrainer(currentTrainer.trainer_id, formData);
            setShowEditModal(false);
            fetchList();
            alert('Trainer updated successfully');
        } catch (error) {
            console.error('Failed to update trainer:', error);
            alert('Failed to update trainer');
        }
    };

    // Reset to page 1 when search term changes
    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    if (loading) return <Spinner className="m-5" animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    // Safe access to trainers with fallback
    const trainerData = trainers || [];
    
    // Filter trainers based on search term
    const filteredTrainers = searchTerm.trim() 
        ? trainerData.filter(trainer => 
            trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            trainer.surname.toLowerCase().includes(searchTerm.toLowerCase()))
        : trainerData;
    
    const totalPages = Math.ceil(filteredTrainers.length / PAGE_SIZE) || 1;
    const slice = filteredTrainers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    
    // Ensure page is in bounds
    if (page > totalPages && totalPages > 0) {
        setPage(totalPages);
    }

    return (
        <div>
            <h2 className="mb-4">Trainer List</h2>
            
            {/* Search Bar */}
            <Form className="mb-3">
                <InputGroup>
                    <Form.Control
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
            </Form>
            
            <div className="d-flex justify-content-between mb-3">
                <Button onClick={fetchList} variant="outline-primary">
                    Refresh
                </Button>
                <span className="text-muted">
                    {filteredTrainers.length} trainer{filteredTrainers.length !== 1 ? 's' : ''} found
                </span>
            </div>
            
            {filteredTrainers.length === 0 ? (
                <Alert variant="info">
                    {searchTerm 
                        ? `No trainers found matching "${searchTerm}"` 
                        : 'No trainers found. Create some trainers first.'}
                </Alert>
            ) : (
                <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#ID</th>
                                <th>Name</th>
                                <th>Surname</th>
                                <th>Contact</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {slice.map(t => (
                                <tr key={t.trainer_id}>
                                    <td>{t.trainer_id}</td>
                                    <td>{t.name}</td>
                                    <td>{t.surname}</td>
                                    <td>{t.contactNumber || 'N/A'}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="primary"
                                                onClick={() => handleEdit(t)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() => handleDelete(t.trainer_id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {totalPages > 1 && (
                        <Pagination className="justify-content-center">
                            <Pagination.Prev
                                onClick={() => setPage(p => Math.max(p - 1, 1))}
                                disabled={page <= 1}
                            />
                            {[...Array(totalPages)].map((_, i) => (
                                <Pagination.Item
                                    key={i + 1}
                                    active={page === i + 1}
                                    onClick={() => setPage(i + 1)}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                                disabled={page >= totalPages}
                            />
                        </Pagination>
                    )}
                </>
            )}
            
            {/* Edit Trainer Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Trainer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentTrainer && (
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
                                <Col md={6}>
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
