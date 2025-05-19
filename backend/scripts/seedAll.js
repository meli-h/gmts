// scripts/seedAll.js
import 'dotenv/config';             // eğer .env kullanıyorsan
import { seedMembers }  from './seedGymMembers.js';
import { seedTrainers } from './seedTrainers.js';
import { seedClasses }  from './seedClasses.js';
import { seedBookings } from './seedBookings.js';

async function main() {
  try {
    console.log('🌱 Starting database seeding...');
    
    await seedMembers(500);
    console.log('------------------------------------');
    
    await seedTrainers(50);
    console.log('------------------------------------');
    
    // Create more classes per trainer with future dates
    await seedClasses(30);
    console.log('------------------------------------');
    
    await seedBookings(5);
    console.log('------------------------------------');
    
    console.log('✅ All data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Unhandled error during seeding:', err);
  process.exit(1);
});
