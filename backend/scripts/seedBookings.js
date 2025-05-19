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

    // Get valid classes (those in the future)
    const [validClasses] = await conn.query(`
      SELECT class_id 
      FROM Class 
      WHERE start_time >= NOW()
    `);
    
    if (validClasses.length === 0) {
      console.warn('⚠️ No future classes found for bookings. Consider running seedClasses with future dates first.');
    }
    
    const validClassIds = validClasses.map(c => c.class_id);
    let totalBookings = 0;
    let skippedBookings = 0;
    let membershipErrors = 0;
    let otherErrors = 0;

    for (let offset = 0; offset < memberCount; offset += 1000) {
      const [members] = await conn.query(`SELECT gymMember_id FROM GymMember LIMIT 1000 OFFSET ?`, [offset]);
      for (const m of members) {
        const k = faker.number.int({min:0,max:avgPerMember*2});
        for (let i = 0; i < k; i++) {
          let classId;
          
          // Prefer using valid future classes if available
          if (validClassIds.length > 0) {
            const randomIndex = faker.number.int({min:0, max:validClassIds.length-1});
            classId = validClassIds[randomIndex];
          } else {
            // Fallback to any class
            classId = faker.number.int({min:1,max:classCount});
          }
          
          try {
            await createBooking(classId, m.gymMember_id, conn);
            totalBookings++;
          } catch (err) {
            if (err.message) {
              if (err.message.includes('Membership inactive for class date')) {
                membershipErrors++;
              } else {
                otherErrors++;
              }
            }
            skippedBookings++;
          }
        }
      }
    }

    await conn.commit();
    console.log(`✅ Bookings seeded: ${totalBookings} created, ${skippedBookings} skipped`);
    if (membershipErrors > 0) {
      console.log(`ℹ️ ${membershipErrors} skipped due to inactive memberships`);
    }
  } catch (err) {
    await conn.rollback();
    console.error('❌ Bookings seed failed', err);
  } finally {
    conn.release();
  }
}
