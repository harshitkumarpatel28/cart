const Sequelize = require("sequelize");
const db = require("../config/db");

const Address = db.define('address', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    street_name_1: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    street_name_2: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    post_code: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    town: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    region: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    country: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    user_id: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        allowNull: false
    }
}, {
    freezeTableName: true,
    underscored: true
});

module.exports = Address;