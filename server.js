// import express and setup server
const express = require('express');
const app = express();
const env = require('dotenv').config().parsed;
const serverMode = env.MODE;
const PORT = process.env.PORT || env.SERVER_PORT;

// import cors
var cors = require('cors');
app.use(cors);

app.get('/', (req, res) => {
    res.send('CART SERVER IS RUNNING!')
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});