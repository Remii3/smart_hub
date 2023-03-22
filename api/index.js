const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const account_routes = require('./routes/account');

const app = express();

require('dotenv').config();

app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));

mongoose.connect(process.env.MONGODB_CONNECTIONURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
() => {
  console.log('connected to DB');
};

app.get('/test', (req, res) => {
  res.json('test ok');
});

app.use('/account', account_routes);

app.listen(4000);
