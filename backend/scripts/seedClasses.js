// scripts/seedClasses.js
import { faker }         from '@faker-js/faker';
import { pool }          from '../database.js';
import { createClass }   from '../repositories/classRepo.js';

export async function seedClasses(perTrainer = 20) {
  const conn = await pool.getConnection();
  try {
    console.log(`Seeding ~${perTrainer} classes per trainer…`);
    await conn.beginTransaction();

    const [trainers] = await conn.query(`SELECT trainer_id FROM Trainer`);
    for (const t of trainers) {
      let lastClassTime = new Date();
      for (let j = 0; j < perTrainer; j++) {
        // Add at least 2 hours between classes
        lastClassTime.setHours(lastClassTime.getHours() + 2 + faker.number.int({min:0,max:4}));
        if (lastClassTime.getHours() >= 20) {
          // If it's too late, move to next day
          lastClassTime.setDate(lastClassTime.getDate() + 1);
          lastClassTime.setHours(6 + faker.number.int({min:0,max:4}));
        }

        try {
          await createClass({
            trainer_id:  t.trainer_id,
            title:       faker.word.adjective() + ' ' + faker.word.noun(),
            start_time:  lastClassTime.toISOString().substring(0,16),
            duration:    faker.number.int({min:30,max:120}),
            capacity:    faker.number.int({min:5,max:30})
          }, conn);
        } catch (err) {
          if (err.status === 409) {
            // If there's a conflict, try again with a different time
            j--;
            continue;
          }
          throw err;
        }
      }
    }

    await conn.commit();
    console.log('✅ Classes seeded');
  } catch (err) {
    await conn.rollback();
    console.error('❌ Classes seed failed', err);
  } finally {
    conn.release();
  }
}
