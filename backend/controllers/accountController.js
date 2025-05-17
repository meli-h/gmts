// backend/controllers/accountController.js
import bcrypt from 'bcrypt';
import {
  listAccounts,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount
} from '../repositories/accountRepo.js';

/* GET /api/accounts */
export const getAllAccounts = async (_req, res) =>
  res.json(await listAccounts());

/* GET /api/accounts/:id */
export const getOneAccount = async (req, res) => {
  const acc = await getAccount(req.params.id);
  if (!acc) return res.status(404).json({ error: 'Account not found' });
  return res.json(acc);
};

/* POST /api/accounts */
export const addAccount = async (req, res) => {
  try {
    const { username, password, account_type } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const id = await createAccount(username, hash, account_type);
    return res.status(201).json({ account_id: id });
    console.log(`Account created: ${id}`, req.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Account not created' });
  }
};

/* PUT /api/accounts/:id */
export const editAccount = async (req, res) => {
  try {
    const { username, account_type } = req.body;
    await updateAccount(req.params.id, username, account_type);
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Account not updated' });
  }
};

/* DELETE /api/accounts/:id */
export const removeAccount = async (req, res) => {
  try {
    await deleteAccount(req.params.id);
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Account not deleted' });
  }
};
