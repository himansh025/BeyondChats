const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'));

app.use('/api/articles', require('./routes/articles'));


app.listen(5000, () => console.log('🚀 Server running on 5000'));
