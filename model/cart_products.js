const Sequelize = require("sequelize");
const db = require("../config/db");
const Cart = require('./cart');
const Products = require('./products');

const CartProducts = db.define('cart_products', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    cart_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Cart,
            key: "id"
        },
        validate: {
            notNull: {
                msg: 'Cart is required'
            }
        }
    },
    product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Products,
            key: "id"
        },
        validate: {
            notNull: {
                msg: 'Product is required'
            }
        }
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Price is required'
            }
        }
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Quantity is required'
            }
        }
    }
}, {
    freezeTableName: true,
    underscored: true,
    timestamps: false
});

module.exports = CartProducts;