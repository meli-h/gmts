// scripts/seedTrainers.js
import { faker }           from '@faker-js/faker';
import { pool }            from '../database.js';
import { createTrainer }   from '../repositories/trainerRepo.js';
import bcrypt from 'bcrypt';

export async function seedTrainers(total = 200) {
  const conn = await pool.getConnection();
  try {
    console.log(`Seeding ${total} trainers…`);
    await conn.beginTransaction();

    for (let i = 0; i < total; i++) {
      const username = String(faker.internet.username() + faker.number.int());
      const rawPass  = String('pw' + faker.internet.password({ length: 6 }));
      const hash     = await bcrypt.hash(rawPass, 10);
      const phone    = `5${faker.number.int({min:0,max:9})}${faker.number.int({min:0,max:9})}-${faker.number.int({min:0,max:9})}${faker.number.int({min:0,max:9})}${faker.number.int({min:0,max:9})}-${faker.number.int({min:0,max:9})}${faker.number.int({min:0,max:9})}${faker.number.int({min:0,max:9})}${faker.number.int({min:0,max:9})}`;
      
      await createTrainer({
        username:       username,
        password:       hash,
        name:           faker.person.firstName(),
        surname:        faker.person.lastName(),
        contactNumber:  phone,
        DateOfBirth:    faker.date.between({ from: '1960-01-01', to: '2000-12-31' }).toISOString().split('T')[0],
        Gender:         faker.person.sex().startsWith('M')?'Male':'Female',
        areaOfExpertise:['Yoga','Pilates','Crossfit','Cardio','Strength'][faker.number.int({min:0,max:4})]
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
