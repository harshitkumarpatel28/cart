const Sequelize = require("sequelize");
const db = require("../config/db");
const Order = require('./order');
const Products = require("./products");

const OrderProducts = db.define('order_products', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Order,
            key: "id"
        },
        validate: {
            notNull: {
                msg: 'Order id is required'
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
                msg: 'Product id is required'
            }
        }
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Name is required'
            }
        }
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: true
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

module.exports = OrderProducts;