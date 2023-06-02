const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const account_routes = require('./Routes/account.routes');
const product_routes = require('./Routes/product.routes');
const cart_routes = require('./Routes/cart.routes');

const app = express();

require('dotenv').config();

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173', 'https://smarthub-jb8g.onrender.com'],
  }),
);
mongoose
  .connect(process.env.MONGODB_CONNECTIONURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`App listening on PORT ${PORT}`);
    });

    app.use('/account', account_routes);
    app.use('/product', product_routes);
    app.use('/cart', cart_routes);
  })
  .catch(err => {
    console.log(err);
  });
