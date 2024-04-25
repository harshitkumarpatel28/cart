const express = require('express');
const userRouter = express.Router();
const User = require('../model/user');
const {getUsername} = require('../config/util');

module.exports = userRouter;

userRouter.get('/profile', async (req, res, next) => {

    // request body
    const username = req.body.username;
    if(username) {

        try {
            const userData = await User.findOne({ 
                where: { "email": username }, 
                attributes: {exclude: ['password']}
            }).then( async (userData) => {
                // if not found send 404
                if(!userData) {
                    return res.status(404).json({ 
                        data: {}, 
                        msg: "",
                        error: "Unable to find user!"
                    });
                }

                // if found then return user data
                return res.status(200).json({
                    data: userData, 
                    msg: "User fetched successfully.", 
                    error: ""
                });
            });
        } catch(error) {
            console.error('Error fetching user profile:', error);
            return res.status(500).json({ 
                data: {}, 
                msg: "", 
                error: 'Internal server error' 
            });
        }
    }
});

userRouter.put('/profile', async (req, res, next) => {

    // request body
    const username = req.body.username;
    if(username) {

        try {
            // check for user data
            await User.findOne({ 
                where: { "email": username }, attributes: { exclude: ['password'] } 
            }).then( async (userData) => {
                // if not found send 404
                if(!userData) {
                    return res.status(404).json({ 
                        data: userData, 
                        msg: "",
                        error: "Unable to find user!"
                    });
                }

                // if found then update
                await userData.update({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    phone_number: req.body.phone_number,
                }).then(() => {
                    return res.status(204).json({
                        data: userData, 
                        msg: "User profile updated successfully.", 
                        error: ""
                    });
                });
            });
        } catch(error) {
            
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                // Extract validation error messages
                console.log('Model errors: ', error);
                const errors = error.errors.map(err => err.message);
                return res.status(400).json({ 
                    data: {}, 
                    msg: "Failed to update user profile!", 
                    error: errors.toString().replace('_', ' ') 
                });
            } else {
                // Handle other types of errors
                console.error('Error updating user profile:', error);
                return res.status(500).json({ 
                    data: {}, 
                    msg: "Failed to update user profile!", 
                    error: 'Internal server error' 
                });
            }
        }
        
    }
});