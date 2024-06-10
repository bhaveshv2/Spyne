const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected -- Discussion Service'))
  .catch(err => console.log(err));

const discussionRoutes = require('./src/routes/discussion');
app.use('/discussions', discussionRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Discussion service running on port ${PORT}`);
});
