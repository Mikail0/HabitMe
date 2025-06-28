const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const habitRoutes = require('./routes/habits.js');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/habits', habitRoutes);

// app.get(habitRoutes, (req, res) => {

// });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server läuft auf Port ${PORT}`));
