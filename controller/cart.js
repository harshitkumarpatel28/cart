const express = require('express');
const cartRouter = express.Router();
const Cart = require('../model/cart');
const User = require('../model/user');
const CartProducts = require('../model/cart_products');
const Products = require('../model/products');
const Order = require('../model/order');
const OrderProducts = require('../model/order_products');

module.exports = cartRouter;

// Create Cart
cartRouter.post('/', async (req, res, next) => {

    try {

        // check if product quantity available
        let allProductIds = [];
        let allProducts = [];
        req.body.product_list.map((productList) => {
            const newObj = {};
            newObj.product_id = productList.product_id; 
            newObj.quantity = productList.quantity;
            // product ids with qty
            allProducts.push(newObj);
            // product ids only
            allProductIds.push(productList.product_id);
        });

        // call product qty data
        let quantityFlag = true;
        await Products.findAll({
            where: {
                id: allProductIds
            }
        }).then( (allProductData) => {

            // if cartData not present then send 404
            if(!allProductData) {
                return res.status(404).json({ 
                    data: {}, 
                    msg: "",
                    error: "Unable to get products data!"
                });
            }
            
            // check quantity of products available or not
            allProductData.forEach(allProductEle => {
                // get quantity from allProducts
                const dataCheck = allProducts.find((prod) => {
                    return prod.product_id === allProductEle.id ? prod : {};
                });
                if(dataCheck) {
                    if(allProductEle.quantity < dataCheck.quantity) {
                        quantityFlag = false;
                    }
                }
            });
            
        }).then( async () => {
            
            console.log('quantityFlag - ', quantityFlag);

            if(quantityFlag === false) {
                return res.status(404).json({ 
                    data: {}, 
                    msg: "",
                    error: "Unable to products! Products quantity is not available."
                });
            }

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

                // if user is found then create cart id
                let cartId = 0;
                await Cart.create({
                    user_id: userData.id
                }).then((newCart) => {
                    cartId = newCart.id;
                });

                // if a new cart is created then add products in cart_products
                let cartProductsData = [];
                req.body.product_list.map((productList) => {
                    const newObj = {};
                    newObj.product_id = productList.product_id; 
                    newObj.price = productList.price; 
                    newObj.quantity = productList.quantity;
                    newObj.cart_id = cartId;
                    cartProductsData.push(newObj);  
                });

                await CartProducts.bulkCreate(cartProductsData)
                .then(() => {
                    // if cart created successfully then send response
                    return res.status(201).json({
                        data: {"cart_id": cartId}, 
                        msg: "Cart created successfully.", 
                        error: ""
                    });
                });
                
            });

        });

        
    } catch(error) {
        console.error('Error creating user cart:', error);
        return res.status(500).json({ 
            data: {}, 
            msg: "", 
            error: 'Internal server error' 
        });
    }


});

// Update Cart
cartRouter.put('/:cart_id', async (req, res, next) => {

    try {
        // get cart_id from params
        const cartId = req.params.cart_id;

        // if product present then update
        if(req.body.product_list.cart_product_id !== 0) {

            // check the quantity for the product
            let productQty = 0;
            await Products.findOne({ 
                where: { "id": req.body.product_list.product_id },
                attributes: [ "id", "name", "quantity" ]
            }).then((productData) => {
                // if Product not found send 404
                if(!productData) {
                    return res.status(404).json({ 
                        data: {}, 
                        msg: "",
                        error: "Unable to find product!"
                    });
                }
    
                // if found then get product qty
                productQty = productData.quantity;
            });

            // check the quantity if available
            if(req.body.product_list.quantity <= productQty) {
                // update the quantity
                await CartProducts.update({ quantity: req.body.product_list.quantity },{
                    where: { "id": req.body.product_list.cart_product_id },
                }).then((cartProductData) => {
                    if(!cartProductData) {
                        return res.status(404).json({ 
                            data: {}, 
                            msg: "",
                            error: "Unable to find product in the cart!"
                        });
                    }

                    return res.status(204).json({});
                });
            } else {
                return res.status(404).json({ 
                    data: {}, 
                    msg: "Product Quantity is less from the requested Cart!",
                    error: "Unable to update product in the cart!"
                });
            }
        }

        // if product absent then add in the cart
        if(req.body.product_list.cart_product_id === 0) {

            await CartProducts.create({
                cart_id: cartId,
                product_id: req.body.product_list.product_id,
                price: req.body.product_list.price,
                quantity: req.body.product_list.quantity
            }).then((newProductAdded) => {

                if(!newProductAdded) {
                    return res.status(400).json({ 
                        data: {}, 
                        msg: "",
                        error: "Unable to add product in the cart!"
                    });
                }

                return res.status(200).json({
                    data: newProductAdded, 
                    msg: "Product added in the cart", 
                    error: "" 
                });
            });
            
        }

    } catch(error) {
        console.error('Error updating user cart:', error);
        return res.status(500).json({ 
            data: {}, 
            msg: "", 
            error: 'Internal server error' 
        });
    }

});

// Remove Cart products & Cart
cartRouter.delete('/:cart_id/:cart_product_id', async (req, res, next) => {

    try {
        // get cart product id from params
        const cartId = req.params.cart_id;
        const cartProductId = req.params.cart_product_id;

        // removing product from cart
        await CartProducts.findOne({
            where: {
                id: cartProductId,
            }
        }).then( async (removeCartProduct) => {
            // if Product not found send 404
            if(!removeCartProduct) {
                return res.status(404).json({ 
                    data: {}, 
                    msg: "",
                    error: "Unable to find product!"
                });
            }

            // if found then remove product from the cart
            await removeCartProduct.destroy({ 
                where: { id: removeCartProduct.id } 
            }).then( async () => {

                // check if the cart has atleast one product
                await CartProducts.findAll({
                    where: {
                        cart_id: cartId,
                    }
                }).then( async (cartProductList) => {

                    // check if length === 0
                    if(cartProductList.length === 0) {
                        // remove cart from cart tbl for user
                        await Cart.destroy({
                            where: {
                                id: cartId,
                            }
                        });
                    }

                    return res.status(200).json({ 
                        data: {}, 
                        msg: "Product removed successfully from the cart.",
                        error: ""
                    });
                });

            });
        });

    } catch(error) {
        console.error('Error removing products from cart:', error);
        return res.status(500).json({ 
            data: {}, 
            msg: "", 
            error: 'Internal server error' 
        });
    }

});

// Cart details
cartRouter.get('/:cart_id', async (req, res, next) => {
    try {

        // association between models cart & cartproducts
        Cart.hasMany(CartProducts, {
            foreignKey: "cart_id"
        });

        CartProducts.belongsTo(Cart);

        Products.hasMany(CartProducts, {
            foreignKey: "product_id"
        });

        CartProducts.belongsTo(Products);

        // get cart data
        const cartId = req.params.cart_id;
        await Cart.findOne({
            where: {
                id: cartId
            },
            include:[{
                model: CartProducts,
                attributes: {exclude: ['cart_id', 'product_id', 'price']},
                include: [{
                    model: Products,
                    attributes: ['name', 'description', 'price', 'quantity']
                }]
            }]
        }).then((cartDetails) => {

            // if CartDetails not found then send 404
            if(!cartDetails) {
                return res.status(404).json({ 
                    data: {}, 
                    msg: "",
                    error: "Unable to find cart details!"
                });
            }

            return res.status(200).json({
                data: cartDetails, 
                msg: "Cart Details fetched successfully",
                error: ""
            });
        });

    } catch(error) {
        console.error('Error fetching user cart:', error);
        return res.status(500).json({ 
            data: {}, 
            msg: "", 
            error: 'Internal server error' 
        });
    }
});

// Checkout 
cartRouter.post('/:cart_id/checkout', async (req, res, next) => {
    try {
        // get cart id
        const cartId = req.params.cart_id;
        let cartQtyFlag = true;
        let newProductQty = [];
        
        // check cart is present or not
        const cartData = await Cart.findOne({
            where: {
                id: cartId
            }
        });

        // if cartData not present then send 404
        if(!cartData) {
            return res.status(404).json({ 
                data: {}, 
                msg: "",
                error: "Unable to find cart!"
            });
        }

        // get user data
        const userData = await User.findOne({ 
            where: { "email": req.body.username }, 
            attributes: {exclude: ['password']}
        })

        // if not found send 404
        if(!userData) {
            return res.status(404).json({ 
                data: {}, 
                msg: "",
                error: "Unable to find user!"
            });
        }

        // check cart quantity if available
        let allProductIds = [];
        let allProducts = [];
        req.body.product_list.map((productList) => {
            const newObj = {};
            newObj.product_id = productList.product_id;
            newObj.quantity = productList.quantity;
            // product ids with qty
            allProducts.push(newObj);
            // product ids only
            allProductIds.push(productList.product_id);
        });

        await Products.findAll({
            where: {
                id: allProductIds
            }
        }).then((allProductData) => {
            // if allProductData not present then send 404
            if(!allProductData) {
                return res.status(404).json({ 
                    data: {}, 
                    msg: "",
                    error: "Unable to get products data!"
                });
            }

            // check quantity of products available or not
            allProductData.forEach(allProductEle => {
                // get quantity from allProducts
                const dataCheck = allProducts.find((prod) => {
                    return prod.product_id === allProductEle.id ? prod : {};
                });
                if(dataCheck) {
                    if(allProductEle.quantity < dataCheck.quantity) {
                        cartQtyFlag = false;
                    } else {
                        // quantity update data for updates after order creation
                        const newQty = {};
                        newQty.id = dataCheck.product_id;
                        newQty.quantity = Number(allProductEle.quantity) - Number(dataCheck.quantity);
                        newProductQty.push(newQty);
                    }
                }
            });
        });

        if(cartQtyFlag === false) {
            return res.status(404).json({ 
                data: {}, 
                msg: "",
                error: "Unable to add products to order! Products quantity is not available."
            });
        }

        // create order
        let orderData = await Order.create({
            user_id: userData.id,
            cart_id: cartData.id,
            address_id: userData.default_address,
            order_amount: req.body.order_amount,
            note: req.body.note,
            status: 1 // 0 - pending, 1 - completed, 2 - pending
        });

        // if order not created send 404
        if(!orderData) {
            return res.status(404).json({ 
                data: {}, 
                msg: "",
                error: "Unable to create order!"
            });
        }
        
        // if created then add order products 
        let orderProductData = req.body.product_list.map((productList) => {
            const newObj = {};
            newObj.order_id = orderData.id;
            newObj.product_id = productList.product_id;
            newObj.name = productList.name;
            newObj.price = productList.price; 
            newObj.quantity = productList.quantity;
            return newObj;
        });

        await OrderProducts.bulkCreate(orderProductData)
        .then( async () => {

            // remove cart data after order creation
            await cartData.destroy();

        });

        // update quantity in products 
        newProductQty.forEach( async (productNewQty) => {
            await Products.update({
                quantity: productNewQty.quantity
            },{
                where: { id: productNewQty.id }
            });
        });
        
        // if order product added successfully then send response
        return res.status(201).json({
            data: {}, 
            msg: "Order created successfully.", 
            error: ""
        });
        

    } catch(error) {
        console.error('Error creating checkout:', error);
        return res.status(500).json({ 
            data: {}, 
            msg: "", 
            error: 'Internal server error' 
        });
    }
});