// backend/scripts/setup.js
import 'dotenv/config';             
import { seedMembers }  from './seedGymMembers.js';
import { seedTrainers } from './seedTrainers.js';
import { seedClasses }  from './seedClasses.js';
import { seedBookings } from './seedBookings.js';
import { createAccount } from '../repositories/accountRepo.js';
import { createAdmin } from '../repositories/administratorRepo.js';
import { findAccountByUsername } from '../repositories/accountRepo.js';
import { pool } from '../database.js';
import bcrypt from 'bcrypt';

async function createAdminAccount() {
  const USERNAME = 'admin';
  const PASSWORD = 'admin';
  
  console.log('🔧 Checking if admin account already exists...');
  
  // Check if admin already exists
  const existingAdmin = await findAccountByUsername(USERNAME);
  if (existingAdmin) {
    console.log('ℹ️ Admin account already exists!');
    return;
  }
  
  // Create new admin account
  console.log('🔧 Creating admin account...');
  
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    
    // Hash the password
    const passwordHash = await bcrypt.hash(PASSWORD, 10);
    
    // Create account
    const accountId = await createAccount(USERNAME, passwordHash, 'Administrator', conn);
    console.log(`✅ Admin account created with ID: ${accountId}`);
    
    // Create administrator record
    const adminId = await createAdmin(accountId, conn);
    console.log(`✅ Administrator record created with ID: ${adminId}`);
    
    await conn.commit();
    console.log('✅ Admin account setup completed successfully!');
    console.log('🔑 Username: admin');
    console.log('🔑 Password: admin');
  } catch (err) {
    await conn.rollback();
    console.error('❌ Failed to create admin account:', err);
  } finally {
    conn.release();
  }
}

async function main() {
  try {
    console.log('🌱 Starting database setup...');
    
    // Create admin account first
    await createAdminAccount();
    console.log('------------------------------------');
    
    // Then seed other data
    await seedMembers(500);
    console.log('------------------------------------');
    
    await seedTrainers(50);
    console.log('------------------------------------');
    
    // Create classes per trainer with future dates
    await seedClasses(30);
    console.log('------------------------------------');
    
    await seedBookings(5);
    console.log('------------------------------------');
    
    console.log('✅ Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Unhandled error during setup:', err);
  process.exit(1);
}); 