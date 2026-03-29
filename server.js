import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/config.js';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('AI Resume Screener API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
