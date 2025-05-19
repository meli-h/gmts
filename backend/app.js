import express from 'express';
import cors from 'cors';
import trainerRoutes from './routes/trainerRoutes.js';
import classRoutes from './routes/classRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import gymMemberRoutes from './routes/gymMemberRoutes.js';
import administratorRoutes from './routes/administratorRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());



app.use('/api/trainers', trainerRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/gym-members', gymMemberRoutes);
app.use('/api/admin', administratorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  console.error('🔥  INTERNAL ERROR:', err);
  res.status(500).send('Something broke!')
})
app.listen(3000, () => {
  console.log('Server is running on port 3000');
})