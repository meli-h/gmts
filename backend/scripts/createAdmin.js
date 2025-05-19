// backend/scripts/createAdmin.js
import 'dotenv/config';
import { pool } from '../database.js';
import { createAccount } from '../repositories/accountRepo.js';
import { createAdmin } from '../repositories/administratorRepo.js';
import { findAccountByUsername } from '../repositories/accountRepo.js';
import bcrypt from 'bcrypt';

async function createAdminAccount() {
  const USERNAME = 'admin';
  const PASSWORD = 'admin';
  
  console.log('🔧 Checking if admin account already exists...');
  
  // Check if admin already exists
  const existingAdmin = await findAccountByUsername(USERNAME);
  if (existingAdmin) {
    console.log('ℹ️ Admin account already exists!');
    process.exit(0);
  }
  
  // Create new admin account
  console.log('🔧 Creating admin account...');
  
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    
    // Hash the password
    const passwordHash = await bcrypt.hash(PASSWORD, 10);
    
    // Create account
    const accountId = await createAccount(USERNAME, passwordHash, 'Admin', conn);
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
    process.exit(0);
  }
}

// Run the script
createAdminAccount().catch(err => {
  console.error('❌ Unhandled error:', err);
  process.exit(1);
}); 