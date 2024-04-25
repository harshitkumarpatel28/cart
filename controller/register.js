const express = require('express');
const registerRouter = express.Router();
const User = require('../model/user');
const bcrypt = require("bcrypt");
const Address = require('../model/address');
const env = require('dotenv').config().parsed;

module.exports = registerRouter;

registerRouter.post('/', async (req, res, next) => {
    // User Registration
    try {
        // Hash password before storing in local DB:
            const salt = await bcrypt.genSalt(Number(env.SALT_NUMBER));
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const user = await User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            gender: req.body.gender,
            email: req.body.email,
            default_address: 0,
            phone_number: req.body.phone_number,
            password: hashedPassword
        });

        // Address Registration
        const address = await Address.create({
            street_name_1: req.body.street_name_1,
            street_name_2: req.body.street_name_2,
            post_code: req.body.post_code,
            town: req.body.town,
            region: req.body.region,
            country: req.body.country,
            user_id: user.id,
        });

        // Update Default Address in User
        user.default_address = address.id;
        user.save();
        return res.status(201).json({
            data: {}, 
            msg: "User registered successfully.",
            error: ""
        });
      } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          // Extract validation error messages
          const errors = error.errors.map(err => err.message);
          return res.status(400).json({ 
            data: {}, 
            msg: "", 
            error: errors.toString() 
        });
        } else {
          // Handle other types of errors
          console.error('Error creating user:', error);
          return res.status(500).json({ 
            data: {}, 
            msg: "", 
            error: 'Internal server error' 
        });
        }
      }
});