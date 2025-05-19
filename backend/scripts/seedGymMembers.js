// scripts/seedGymMembers.js
import { faker } from '@faker-js/faker';
import { pool }  from '../database.js';
import { createAccount }    from '../repositories/accountRepo.js';
import { createMember }     from '../repositories/gymMemberRepo.js';

export async function seedMembers(total = 5000) {
  const conn = await pool.getConnection();
  try {
    console.log(`Seeding ${total} members…`);
    await conn.beginTransaction();

    for (let i = 0; i < total; i++) {
      const username = faker.internet.userName() + faker.datatype.number();
      const rawPass  = 'pw' + faker.internet.password(6);

      // 1) Account
      const accountId = await createAccount({
        username,
        account_password: rawPass,
        account_type: 'GymMember'
      }, conn);

      // 2) Member
      const firstName       = faker.name.firstName();
      const surname         = faker.name.lastName();
      const phone           = faker.phone.number('5##-###-####');
      const dob             = faker.date.between('1950-01-01','2005-12-31').toISOString().split('T')[0];
      const gender          = faker.name.sexType().startsWith('M')?'Male':'Female';
      const types           = ['Monthly','Quarterly','Yearly'];
      const mtype           = types[faker.datatype.number({min:0,max:2})];
      const startDate       = faker.date.recent(30).toISOString().split('T')[0];
      const endDate         = new Date(new Date(startDate).getTime() +
                             (mtype==='Monthly'?30: mtype==='Quarterly'?90:365)*24*3600*1000)
                             .toISOString().split('T')[0];

      await createMember({
        name:             firstName,
        surname,
        contactNumber:    phone,
        DateOfBirth:      dob,
        Gender:           gender,
        membership_type:  mtype,
        member_start_date:startDate,
        member_end_date:  endDate,
        account_id:       accountId
      }, conn);
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
