const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected -- User Service'))
    .catch(err => console.log(err));

app.use('/users', require('./src/routes/user'));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});