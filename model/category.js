const Sequelize = require("sequelize");
const db = require("../config/db");
const ProductsCategory = require('./products_category');
const Products = require("./products");

const Category = db.define('category', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Name is required'
            }
        }
    }
}, {
    freezeTableName: true,
    underscored: true
});

module.exports = Category;