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
      for (let j = 0; j < perTrainer; j++) {
        const dt = new Date();
        dt.setDate(dt.getDate() + faker.datatype.number({min:1,max:60}));
        dt.setHours(faker.datatype.number({min:6,max:20}),0,0,0);

        await createClass({
          trainer_id:  t.trainer_id,
          title:       faker.word.adjective() + ' ' + faker.word.noun(),
          start_time:  dt.toISOString().substring(0,16),
          duration:    faker.datatype.number({min:30,max:120}),
          capacity:    faker.datatype.number({min:5,max:30})
        }, conn);
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
