const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const exchangeRoutes = require('./routes/exchangeRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/exchange', exchangeRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'SkillSwap API is running! ' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
