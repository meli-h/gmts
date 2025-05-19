// scripts/seedBookings.js
import { faker }         from '@faker-js/faker';
import { pool }          from '../database.js';
import { createBooking } from '../repositories/bookingRepo.js';

export async function seedBookings(avgPerMember = 5) {
  const conn = await pool.getConnection();
  try {
    console.log(`Seeding bookings…`);
    await conn.beginTransaction();

    const [[{count: memberCount}]] = await conn.query(`SELECT COUNT(*) AS count FROM GymMember`);
    const [[{count: classCount}]]  = await conn.query(`SELECT COUNT(*) AS count FROM Class`);

    for (let offset = 0; offset < memberCount; offset += 1000) {
      const [members] = await conn.query(`SELECT gymMember_id FROM GymMember LIMIT 1000 OFFSET ?`, [offset]);
      for (const m of members) {
        const k = faker.number.int({min:0,max:avgPerMember*2});
        for (let i = 0; i < k; i++) {
          const classId = faker.number.int({min:1,max:classCount});
          try {
            await createBooking(classId, m.gymMember_id, conn);
          } catch {
            // kapasite ya da duplicate hatası atla
          }
        }
      }
    }

    await conn.commit();
    console.log('✅ Bookings seeded');
  } catch (err) {
    await conn.rollback();
    console.error('❌ Bookings seed failed', err);
  } finally {
    conn.release();
  }
}
