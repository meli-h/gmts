// scripts/seedAll.js
import 'dotenv/config';             // eğer .env kullanıyorsan
import { seedMembers }  from './seedGymMembers.js';
import { seedTrainers } from './seedTrainers.js';
import { seedClasses }  from './seedClasses.js';
import { seedBookings } from './seedBookings.js';

async function main() {
  await seedMembers(5000);
  await seedTrainers(200);
  await seedClasses(20);
  await seedBookings(5);
  process.exit(0);
}

main().catch(err=>{
  console.error(err);
  process.exit(1);
});
