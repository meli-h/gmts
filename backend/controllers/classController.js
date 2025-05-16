// backend/controllers/classController.js
import {
  listUpcomingClasses,
  deleteClass as deleteClassRepo,
  updateClass as updateClassRepo    // ❷  'as' ile YENI İSİM verdik
} from '../repositories/classRepo.js';

/* ❸  GET /api/classes  */
export const getAllClasses = async (_req, res) =>
  res.json(await listUpcomingClasses());

/* ❹  DELETE /api/classes/:id  */
export const removeClass = async (req, res) => {
  try {
    await deleteClassRepo(req.params.id);     // ← repo fonksiyonunun çağrısı
    return res.status(204).send();            // 204 No-Content
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Class not deleted' });
  }
};

export const updateClass = async (req, res) => {
  const { title, capacity } = req.body;
  const class_id = req.params.id;

  try {
    await updateClassRepo(title, capacity, class_id); // ← repo fonksiyonunun çağrısı
    console.log('Class updated:', { title, capacity, class_id });
    return res.status(204).send();                    // 204 No-Content
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Class not updated' });
  }
};
