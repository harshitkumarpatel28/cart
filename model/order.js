const Sequelize = require("sequelize");
const db = require("../config/db");
const Users = require('./user');
const Address = require('./address');

const Order = db.define('orders', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Users,
            key: "id"
        },
        validate: {
            notNull: {
                msg: 'User is required'
            }
        }
    },
    cart_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Cart is required'
            }
        }
    },
    address_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Address,
            key: "id"
        },
        validate: {
            notNull: {
                msg: 'Address is required'
            }
        }
    },
    order_amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Amount is required'
            }
        }
    },
    note: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    status: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Status is required'
            }
        }
    }
}, {
    freezeTableName: true,
    underscored: true
});

module.exports = Order;