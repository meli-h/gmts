import express from 'express';
import cors from 'cors';
import trainerRoutes from './routes/trainerRoutes.js';
import classRoutes   from './routes/classRoutes.js';
import accountRoutes from './routes/accountRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/accounts', (req, res) => {
    res.send('accounts')
})




app.use('/api/trainers', trainerRoutes);
app.use('/api/classes',  classRoutes);
app.use('/api/accounts', accountRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!')
  })
app.listen(3000, () => {
  console.log('Server is running on port 3000');
})