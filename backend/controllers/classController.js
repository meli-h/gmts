// backend/controllers/classController.js
import {
  listUpcomingClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass
} from '../repositories/classRepo.js';

/* GET  /api/classes */
export const getAllClasses = async (_req, res) => {
  const list = await listUpcomingClasses();
  res.json(list);
};

/* GET  /api/classes/:id */
export const getOneClass = async (req, res) => {
  const cls = await getClassById(req.params.id);
  if (!cls) return res.status(404).json({ error: 'Class not found' });
  res.json(cls);
};

/* POST /api/classes */
export const addClass = async (req, res) => {
  try {
    const newId = await createClass(req.body);
    res.status(201).json({ class_id: newId });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message });
  }
};

/* PUT  /api/classes/:id */
export const editClass = async (req, res) => {
  try {
    await updateClass(req.params.id, req.body);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    // Use the specific error message and status from the repository if available
    res.status(err.status || 500).json({ 
      error: err.message || 'Class not updated' 
    });
  }
};

/* DELETE /api/classes/:id */
export const removeClass = async (req, res) => {
  try {
    await deleteClass(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Class not deleted' });
  }
};
