const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const user_routes = require('./Routes/user.routes');
const product_routes = require('./Routes/product.routes');
const cart_routes = require('./Routes/cart.routes');
const category_routes = require('./Routes/category.routes');
const comment_routes = require('./Routes/comment.routes');
const order_routes = require('./Routes/order.routes');
const admin_routes = require('./Routes/admin.routes');
const news_routes = require('./Routes/news.routes');
const app = express();
const server = require('http').createServer(app);

require('dotenv').config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://smarthub-jb8g.onrender.com",
    ],
  })
);
server.listen(8080, () => console.log('listening on http://localhost:8080'));
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
    app.use('/user', user_routes);
    app.use('/product', product_routes);
    app.use('/cart', cart_routes);
    app.use('/category', category_routes);
    app.use('/comment', comment_routes);
    app.use('/order', order_routes);
    app.use('/admin', admin_routes);
    app.use('/news', news_routes);
  })
  .catch(err => {
    console.log(err);
    process.exit();
  });
