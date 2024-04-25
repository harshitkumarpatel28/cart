// import express and setup server
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const env = require('dotenv').config().parsed;
const serverMode = env.MODE;
const PORT = process.env.PORT || env.SERVER_PORT;

// import cors, use body parser, db
var cors = require('cors');
app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const db = require('./config/db');

app.get('/', (request, response) => {
    response.json({ info: 'Cart project is running' })
});

// passport, express session 
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

// Use session middleware
app.use(session({
    secret: env.APP_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// register
const registerRouter = require('./controller/register');
app.use('/register', registerRouter);

// login
const loginRouter = require('./controller/login');
app.use('/login', loginRouter);

// authentication
const jwt = require('jsonwebtoken');
const jwtMiddleware = (req, res, next) => {
    if(!req.header('Authorization')) {
        return res.status(404).json({ error: 'No authorization provided!' });
    }
    const token = req.header('Authorization').split(' ')[1];
    jwt.verify(token, env.APP_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token.' });
        }
        req.body.username = decoded.username;// change the user id storage!
        next();
    });
};

// routes
const apiRouter = require('./routes/api');
app.use('/api', jwtMiddleware, apiRouter);

app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).send('Internal Server Error');
});


app.listen(PORT,async () => {
    console.log(`App is running on PORT ${PORT}`);
    try {
        await db.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
});