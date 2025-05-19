// scripts/seedGymMembers.js
import { faker } from '@faker-js/faker';
import { pool }  from '../database.js';
import { createAccount }    from '../repositories/accountRepo.js';
import { createGymMember }  from '../repositories/gymMemberRepo.js';
import bcrypt from 'bcrypt';

export async function seedMembers(total = 5000) {
  const conn = await pool.getConnection();
  try {
    console.log(`Seeding ${total} members…`);
    await conn.beginTransaction();

    // Process in batches of 100
    const BATCH_SIZE = 100;
    for (let batch = 0; batch < total; batch += BATCH_SIZE) {
      const currentBatchSize = Math.min(BATCH_SIZE, total - batch);
      console.log(`Processing batch ${batch/BATCH_SIZE + 1} of ${Math.ceil(total/BATCH_SIZE)}...`);
      
      const batchPromises = [];
      for (let i = 0; i < currentBatchSize; i++) {
        const username = String(faker.internet.username() + faker.number.int());
        const rawPass  = String('pw' + faker.internet.password({ length: 6 }));

        const firstName       = faker.person.firstName();
        const surname         = faker.person.lastName();
        const phone           = `5${faker.number.int({min:0,max:9})}${faker.number.int({min:0,max:9})}-${faker.number.int({min:0,max:9})}${faker.number.int({min:0,max:9})}${faker.number.int({min:0,max:9})}-${faker.number.int({min:0,max:9})}${faker.number.int({min:0,max:9})}${faker.number.int({min:0,max:9})}${faker.number.int({min:0,max:9})}`;
        const dob             = faker.date.between({ from: '1950-01-01', to: '2005-12-31' }).toISOString().split('T')[0];
        const gender          = faker.person.sex().startsWith('M')?'Male':'Female';
        const types           = ['Monthly','Quarterly','Yearly'];
        const mtype           = types[faker.number.int({min:0,max:2})];
        const startDate       = faker.date.recent({ days: 30 }).toISOString().split('T')[0];
        const endDate         = new Date(new Date(startDate).getTime() +
                               (mtype==='Monthly'?30: mtype==='Quarterly'?90:365)*24*3600*1000)
                               .toISOString().split('T')[0];

        batchPromises.push(createGymMember({
          name:             firstName,
          surname,
          contactNumber:    phone,
          DateOfBirth:      dob,
          Gender:           gender,
          membership_type:  mtype,
          member_start_date:startDate,
          member_end_date:  endDate,
          username:         username,
          password:         rawPass
        }, conn));
      }

      // Wait for all members in this batch to be created
      await Promise.all(batchPromises);
    }

    await conn.commit();
    console.log('✅ Members seeded');
  } catch (err) {
    await conn.rollback();
    console.error('❌ Members seed failed', err);
  } finally {
    conn.release();
  }
}
