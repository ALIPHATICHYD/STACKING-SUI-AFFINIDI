//  1. Import required Libraries
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const { Issuer, Strategy } = require('openid-client');
const http = require("http");
require("dotenv").config();

//  2. Create an express application and set up session
const app = express();
app.use(session({
    secret: 'my-secret',
    resave: false ,
    saveUninitialized: false
}));

// 3. Define application end-points
app.get("/", (req, res) => {
    res.send(" Lets build a Unified Digital Identity <br/><br/><a href='/login'> Affinidi Login</a>");
})

app.get('/login',
    function (req, res, next) {
        next();
    },
);

app.get('/login/callback', (req, res, next) => {})

app.get("/protected", (req, res) => {
    res.header("Content-Type", 'application/json');
    res.end("Protected Content for Authenticated Users");
})

// 4. Start the http server
const httpServer = http.createServer(app)
httpServer.listen(8080, () => {
    console.log(`Hello World - Affinidi Login : Up and running on 8080`)
})