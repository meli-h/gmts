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
    let classesCreated = 0;
    
    // Start from today + 1 day to ensure future classes
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1); // Start from tomorrow
    startDate.setHours(8, 0, 0, 0); // Start at 8 AM
    
    for (const t of trainers) {
      // Each trainer gets their own timeline starting from tomorrow
      let lastClassTime = new Date(startDate);
      
      for (let j = 0; j < perTrainer; j++) {
        // Add hours between classes for a more realistic schedule
        lastClassTime.setHours(lastClassTime.getHours() + 2 + faker.number.int({min:0,max:3}));
        
        // If it's too late in the day, move to next day
        if (lastClassTime.getHours() >= 20) {
          lastClassTime.setDate(lastClassTime.getDate() + 1);
          lastClassTime.setHours(6 + faker.number.int({min:0,max:4}), 0, 0);
        }

        try {
          // Format date to MySQL datetime format: YYYY-MM-DD HH:MM:SS
          const formattedDate = formatMySQLDateTime(lastClassTime);
          
          const className = faker.helpers.arrayElement([
            'Intense', 'Power', 'Gentle', 'Beginner', 'Advanced', 'Morning', 'Evening'
          ]) + ' ' + faker.helpers.arrayElement([
            'Yoga', 'Pilates', 'Zumba', 'Spin', 'HIIT', 'Boxing', 'Cardio', 'Strength', 'Stretching'
          ]);
          
          await createClass({
            trainer_id:  t.trainer_id,
            title:       className,
            start_time:  formattedDate,
            duration:    faker.helpers.arrayElement([30, 45, 60, 90, 120]),
            capacity:    faker.number.int({min:5,max:30})
          }, conn);
          
          classesCreated++;
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
    console.log(`✅ ${classesCreated} classes seeded`);
  } catch (err) {
    await conn.rollback();
    console.error('❌ Classes seed failed', err);
  } finally {
    conn.release();
  }
}

// Helper function to format date for MySQL
function formatMySQLDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
