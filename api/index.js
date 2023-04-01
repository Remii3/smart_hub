const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const user_routes = require('./Routes/user.routes');

const app = express();

require('dotenv').config();

app.use(express.json());
app.use(cookieParser());
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

app.use('/account', user_routes);

app.listen(4000);
