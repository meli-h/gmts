// backend/controllers/authController.js
import bcrypt                           from 'bcrypt';
import { findAccountByUsername }       from '../repositories/accountRepo.js';
import { getTrainerByAccountId }       from '../repositories/trainerRepo.js';
import { getMemberByAccountId }        from '../repositories/gymMemberRepo.js';

export async function login(req, res) {
  const { username, password } = req.body;
  const acct = await findAccountByUsername(username);
  if (!acct) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, acct.account_password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const payload = {
    account_id: acct.account_id,
    account_type: acct.account_type,
    username: acct.username
  };

  if (acct.account_type === 'Trainer') {
    const t = await getTrainerByAccountId(acct.account_id);
    payload.trainer_id = t.trainer_id;
  }
  else if (acct.account_type === 'GymMember') {
    const m = await getMemberByAccountId(acct.account_id);
    payload.member_id = m.gymMember_id;
  }

  return res.json(payload);
}
