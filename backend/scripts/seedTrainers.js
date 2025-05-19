// scripts/seedTrainers.js
import { faker }           from '@faker-js/faker';
import { pool }            from '../database.js';
import { createTrainer }   from '../repositories/trainerRepo.js';

export async function seedTrainers(total = 200) {
  const conn = await pool.getConnection();
  try {
    console.log(`Seeding ${total} trainers…`);
    await conn.beginTransaction();

    for (let i = 0; i < total; i++) {
      await createTrainer({
        username:       faker.internet.userName() + faker.datatype.number(),
        password:       'pw' + faker.internet.password(6),
        name:           faker.name.firstName(),
        surname:        faker.name.lastName(),
        contactNumber:  faker.phone.number('5##-###-####'),
        DateOfBirth:    faker.date.between('1960-01-01','2000-12-31').toISOString().split('T')[0],
        Gender:         faker.name.sexType().startsWith('M')?'Male':'Female',
        areaOfExpertise:['Yoga','Pilates','Crossfit','Cardio','Strength'][faker.datatype.number({min:0,max:4})]
      }, conn);
    }

    await conn.commit();
    console.log('✅ Trainers seeded');
  } catch (err) {
    await conn.rollback();
    console.error('❌ Trainers seed failed', err);
  } finally {
    conn.release();
  }
}
