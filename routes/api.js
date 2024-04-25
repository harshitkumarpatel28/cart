const express = require('express');
const apiRouter = express.Router();

// User Router
const userRouter = require('../controller/user');
apiRouter.use('/user', userRouter);

// Products Router
const productsRouter = require('../controller/products');
apiRouter.use('/products', productsRouter);

// Cart Router
const cartRouter = require('../controller/cart');
apiRouter.use('/cart', cartRouter);

// Order Router
const OrderRouter = require('../controller/order');
apiRouter.use('/orders', OrderRouter);

module.exports = apiRouter;
