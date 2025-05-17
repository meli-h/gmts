import {
  listMembers, getMember, createMember,
  updateMember, deleteMember
} from '../repositories/gymMemberRepo.js';

/* GET /api/members */
export const getAllMembers = async (_req, res) =>
  res.json(await listMembers());

// GET /api/members/:id                                                     ????
export const getOneMember = async (req, res) => {
  const m = await getMember(req.params.id);
  if (!m) return res.status(404).json({ error: 'GymMember not found' });
  res.json(m);
};

/* POST /api/members */
export const addMember = async (req, res) => {
  try {
    const id = await createMember(req.body);
    res.status(201).json({ gymMember_id: id });
    console.log('GymMember created:', req.body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'GymMember not created' });
  }
};

/* PUT /api/members/:id */
export const editMember = async (req, res) => {
  try {
    await updateMember(req.params.id, req.body);
    console.log("GymMember updated:", req.body);
    res.status(204).send();
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'GymMember not updated' });
  }
};

/* DELETE /api/members/:id */
export const removeMember = async (req, res) => {
  try {
    await deleteMember(req.params.id);
    res.status(204).send();
    console.log(`GymMember with ${id} deleted:`, req.params.id);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'GymMember not deleted' });
  }
};
