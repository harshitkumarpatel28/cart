const Sequelize = require("sequelize");
const db = require("../config/db");
const ProductsCategory = require("./products_category");
const Category = require("./category");

const Products = db.define('products', {
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
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Description is required'
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
    underscored: true
});

// Products.hasMany(ProductsCategory, {
//     foreignKey: "product_id"
// });
  
module.exports = Products;