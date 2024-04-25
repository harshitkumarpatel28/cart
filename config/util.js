const jwt = require('jsonwebtoken');
const env = require('dotenv').config().parsed;
const User = require('../model/user');
const Products = require('../model/products');

// set User Data
const getUserData = async (username) => {
    if(username) {
        return await User.findOne({ where: { "email": username } });
    }
};

module.exports = {
    getUserData
}