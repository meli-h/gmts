import {
  listTrainers, getTrainer, createTrainer,
  updateTrainer, deleteTrainer
} from '../repositories/trainerRepo.js';

export const getAllTrainers = async (_req, res) =>
  res.json(await listTrainers());

export const getOneTrainer = async (req, res) => {
  const t = await getTrainer(req.params.id);
  if (!t) return res.status(404).json({ error: 'Trainer not found' });
  res.json(t);
};

export const addTrainer = async (req, res) => {
  try {
    const id = await createTrainer(req.body);
    res.status(201).json({ trainer_id: id });
    console.log('Trainer created with ID:', id);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Trainer not created' });
  }
};

export const editTrainer = async (req, res) => {
  try {
    await updateTrainer(req.params.id, req.body);
    res.status(204).send();
    console.log('Trainer updated with ID:', req.params.id);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Trainer not updated' });
  }
};

export const removeTrainer = async (req, res) => {
  try {
    await deleteTrainer(req.params.id);
    res.status(204).send();
    console.log('Trainer deleted with ID:', req.params.id);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Trainer not deleted' });
  }
};
