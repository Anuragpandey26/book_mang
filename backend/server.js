import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models/index.js';
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import authorRoutes from './routes/authors.js';
import userRoutes from './routes/users.js';
import borrowRoutes from './routes/borrow.js';
import borrowRequestRoutes from './routes/borrowRequest.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/users', userRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/borrow-requests', borrowRequestRoutes);
app.use('/api', borrowRoutes);
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => console.error('Error:', err.message));
