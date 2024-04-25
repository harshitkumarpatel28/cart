const express = require('express');
const orderRouter = express.Router();
const User = require('../model/user');
const Products = require('../model/products');
const Order = require('../model/order');
const OrderProducts = require('../model/order_products');
const Address = require('../model/address');

module.exports = orderRouter;

orderRouter.get('/', async (req, res, next) => {

    try {
        // get user id
        await User.findOne({ 
            where: { "email": req.body.username }, 
            attributes: {exclude: ['password']}
        }).then( async (userData) => {
            // if not found send 404
            if(!userData) {
                return res.status(404).json({ 
                    data: {}, 
                    msg: "",
                    error: "Unable to find user!"
                });
            }
            
            // association between models - order, order_products
            Order.hasMany(OrderProducts, {
                foreignKey: "order_id"
            });
    
            OrderProducts.belongsTo(Order);

            Products.hasMany(OrderProducts, {
                foreignKey: "product_id"
            });
    
            OrderProducts.belongsTo(Products);

            Order.findAll({
                where: {
                    user_id: userData.id 
                },
                attributes: {exclude: ['cart_id', 'user_id', 'address_id', 'note']},
                include: [{
                    model: OrderProducts,
                }]
            }).then((orderList) => {

                // if orderList not found then send 404
                if(!orderList) {
                    return res.status(404).json({ 
                        data: {}, 
                        msg: "",
                        error: "Unable to find orders for user!"
                    });
                }

                // if found then send the order list
                return res.status(200).json({
                    data: orderList, 
                    msg: "Order List fetched successfully",
                    error: ""
                });

            });
        });

    } catch(error) {
        console.error('Error fetching orders for user:', error);
        return res.status(500).json({ 
            data: {}, 
            msg: "", 
            error: 'Internal server error' 
        });
    }

});

orderRouter.get('/:order_id', async (req, res, next) => {
    try {
        // association between models - order, order_products
        Order.hasMany(OrderProducts, {
            foreignKey: "order_id"
        });

        OrderProducts.belongsTo(Order);

        Products.hasMany(OrderProducts, {
            foreignKey: "product_id"
        });

        OrderProducts.belongsTo(Products);

        User.hasMany(Order, {
            foreignKey: "user_id"
        });

        Order.belongsTo(User);

        User.hasMany(Address, {
            foreignKey: "user_id"
        });

        Address.belongsTo(User);

        Order.findAll({
            where: {
                id: req.params.order_id 
            },
            attributes: {exclude: ['cart_id', 'user_id', 'address_id', 'note']},
            include: [{
                model: OrderProducts,
            },{
                model: User,
                include: [{
                    model: Address
                }]
            }]
        }).then((orderList) => {
            
            // if orderList not found then send 404
            if(orderList.length === 0) {
                return res.status(404).json({ 
                    data: {}, 
                    msg: "",
                    error: "Unable to find order details!"
                });
            } else {
                // if found then send the order list
                return res.status(200).json({
                    data: orderList, 
                    msg: "Order List fetched successfully",
                    error: ""
                });
            }

        });

    } catch(error) {
        console.error('Error fetching orders for user:', error);
        return res.status(500).json({ 
            data: {}, 
            msg: "", 
            error: 'Internal server error' 
        });
    }
});