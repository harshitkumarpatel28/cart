const express = require('express');
const loginRouter = express.Router();
const User = require('../model/user');
const {getUserData} = require('../config/util');
const bcrypt = require("bcrypt");
const env = require('dotenv').config().parsed;
const jwt = require('jsonwebtoken');

module.exports = loginRouter;

loginRouter.post('/', async (req, res, next) => {
    try {

        const userData = await getUserData(req.body.username); // get User data
        if(!userData) {
            return res.status(404).json({ 
                data: {}, 
                msg: "",
                error: "Invalid Username or Password!"
            });
        }

        const matchedPassword = await bcrypt.compare(req.body.password, userData.password);
        if(matchedPassword == false) {
             // User is found but invalid password
            return res.status(404).json({ 
                data: {}, 
                msg: "",
                error: "Invalid Username or Password!"
            });
        }

        let username = userData.email;
        const token = jwt.sign({ username }, env.APP_SECRET, { expiresIn: '12h' });
        // Return User if everything is correct
        return res.status(200).json({
            token: token, 
            msg: "User logged in successfully.",
            error: ""
        });

    } catch(error) {
        console.log(error)
        return res.status(500).json({ 
            data: {}, 
            msg: "", 
            error: "Failed to authenticate user."
        });
    }
});