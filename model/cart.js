const Sequelize = require("sequelize");
const db = require("../config/db");
const Users = require('./user');

const Cart = db.define('cart', {
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
    }
}, {
    freezeTableName: true,
    underscored: true
});

module.exports = Cart;