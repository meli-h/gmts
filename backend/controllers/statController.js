import { pool } from '../database.js';

// Get trainers with class counts and total participants
export const getTrainerStats = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        t.trainer_id,
        CONCAT(t.name,' ',t.surname) AS trainer,
        COUNT(DISTINCT c.class_id)   AS class_cnt,
        COUNT(b.booking_id)          AS total_participants
      FROM Trainer t
      LEFT JOIN Class   c ON c.trainer_id = t.trainer_id
      LEFT JOIN Booking b ON b.class_id   = c.class_id
      GROUP BY t.trainer_id, trainer
      ORDER BY total_participants DESC
      LIMIT 10
    `);
    
    res.json(rows);
  } catch (err) {
    console.error('Error fetching trainer stats:', err);
    res.status(500).json({ error: 'Failed to fetch trainer statistics' });
  }
};

// Get membership type distribution
export const getMembershipDistribution = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        membership_type,
        COUNT(*)                 AS member_count,
        ROUND(COUNT(*) * 100 /
              (SELECT COUNT(*) FROM GymMember), 1) AS pct_total
      FROM GymMember
      GROUP BY membership_type
    `);
    
    res.json(rows);
  } catch (err) {
    console.error('Error fetching membership distribution:', err);
    res.status(500).json({ error: 'Failed to fetch membership distribution' });
  }
};

// Get members with no bookings
export const getInactiveMembers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT g.gymMember_id, g.name, g.surname
      FROM   GymMember g
      LEFT JOIN Booking b ON b.gymMember_id = g.gymMember_id
      WHERE  b.booking_id IS NULL
      LIMIT 100
    `);
    
    res.json(rows);
  } catch (err) {
    console.error('Error fetching inactive members:', err);
    res.status(500).json({ error: 'Failed to fetch inactive members' });
  }
}; 