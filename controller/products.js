const express = require('express');
const productsRouter = express.Router();
const Products = require('../model/products');
const ProductsCategory = require('../model/products_category');
const Category = require('../model/category');

module.exports = productsRouter;

// by product id
productsRouter.get('/:product_id', async (req, res, next) => {

    // params product_id
    let product_id = req.params.product_id;
    try {
        
        await Products.findOne({ 
            where: { "id": product_id }  
        }).then((productData) => {
            // if Product not found send 404
            if(!productData) {
                return res.status(404).json({ 
                    data: {}, 
                    msg: "",
                    error: "Unable to find product!"
                });
            }

            // if found then return product data
            return res.status(200).json({
                data: productData, 
                msg: "Product fetched successfully.", 
                error: ""
            });
        });
         
    } catch(error) {
        console.error('Error fetching product:', error);
        return res.status(500).json({ 
            data: {}, 
            msg: "", 
            error: 'Internal server error' 
        });
    }
});

// product list, with and without category 
productsRouter.get('/', async (req, res, next) => {

    // check query string for category
    let queryString = req.query;
    if(queryString.category) {
        console.log(queryString);

        try {
            Category.hasMany(ProductsCategory, {
                foreignKey: "category_id"
            });
    
            ProductsCategory.belongsTo(Category);
    
            Products.hasMany(ProductsCategory, {
                foreignKey: "product_id"
            });
    
            ProductsCategory.belongsTo(Products); 
            
            await Category.findByPk(queryString.category, {
                include: [{
                    model: ProductsCategory,
                    attributes: ['id', 'product_id', 'category_id'],
                    limit: Number(queryString.limit),
                    offset: Number(queryString.offset),
                    include: [{
                        model: Products,
                        attributes: ['name', 'description', 'price', 'quantity']
                    }]
                }]
            }).then((productsInCategory) => {
                // if productsInCategory not found send 404
                if(!productsInCategory) {
                    return res.status(404).json({ 
                        data: {}, 
                        msg: "",
                        error: "Unable to find product by category!"
                    });
                }

                // if productsInCategory found then send response
                return res.status(200).json({
                    data: productsInCategory, 
                    msg: "Product fetched successfully.", 
                    error: ""
                });
            });
            
        } catch(error) {
            console.error('Error fetching product by category:', error);
            return res.status(500).json({ 
                data: {}, 
                msg: "", 
                error: 'Internal server error' 
            });
        }
    } else {
        // product list without query string
        try {
            await Products.findAll({ 
                limit: Number(queryString.limit),
                offset: Number(queryString.offset)
            }).then((productData)=> {
                // if productData not found then send 404
                if(!productData) {
                    return res.status(404).json({ 
                        data: {}, 
                        msg: "",
                        error: "Unable to find products!"
                    });
                }

                // if prodctData found then send response
                return res.status(200).json({
                    data: productData, 
                    msg: "Product list fetched successfully.", 
                    error: ""
                });
            }); 
            
        } catch(error) {
            console.error('Error fetching product list:', error);
            return res.status(500).json({ 
                data: {}, 
                msg: "", 
                error: 'Internal server error' 
            });
        }
    }   
});