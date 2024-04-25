const Sequelize = require("sequelize");
const db = require("../config/db");
const Products = require('./products');
const Category = require("./category");

const ProductsCategory = db.define('products_category', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Products,
            key: "id"
        }
    },
    category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: "id"
        }
    }
}, {
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    freezeTableName: true,
});



module.exports = ProductsCategory;