const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));

app.get('/test', (req, res) => {
  res.json('test ok');
});

app.post('/register', (req, res) => {
  res.json('register');
});
app.post('/login', (req, res) => {
  res.json('login');
});
app.post('/logout', (req, res) => {
  res.json('logout');
});

app.listen(4000);
