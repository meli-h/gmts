import {
  getAdmin, createAdmin, updateAdmin, deleteAdmin
} from '../repositories/administratorRepo.js';

export const getAdministrator = async (_req, res) =>
  res.json(await getAdmin());

export const addAdministrator = async (req, res) => {
  try {
    const id = await createAdmin(req.body.account_id);
    res.status(201).json({ administrator_id: id });
    console.log('Admin created with ID:', id);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Admin not created' });
  }
};

export const editAdministrator = async (req, res) => {
  try {
    await updateAdmin(req.params.id, req.body.account_id);
    res.status(204).send();
    console.log('Admin updated :', req.params.id);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Admin not updated' });
  }
};

export const removeAdministrator = async (req, res) => {
  try {
    await deleteAdmin(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Admin not deleted' });
  }
};
