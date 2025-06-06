//  1. Import required Libraries
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const { Issuer, Strategy } = require('openid-client');
const http = require("http");
require("dotenv").config();

//  2. Create an express application and setup session
const app = express();
app.use(session({
    secret: 'my-secret',
    resave: false ,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// 3. Define application end-points
app.get("/", (req, res) => {
    res.send(" Lets build a Unified Digital Identity <br/><br/><a href='/login'> Affinidi Login</a>");
})

app.get('/login',
    function (req, res, next) {
        next();
    },
    passport.authenticate('affinidi-login',{scope:'openid'})
);

app.get('/login/callback', (req, res, next) => {
    passport.authenticate('affinidi-login', {successRedirect: '/protected', failureRedirect: '/'})(req,res,next)
})

app.get("/protected", (req, res) => {
    res.header("Content-Type", 'application/json');
    res.end(JSON.stringify(req.user, null, 4));
})

// 4. Start the http server
const httpServer = http.createServer(app)
httpServer.listen(8080, () => {
    console.log(`Hello World - Affinidi Login : Up and running on 8080`)
})

// 5. Integrate Authentication
// 5a. Discover Affinidi Login - Issuer
Issuer.discover(process.env.issuer).then(function (oidcIssuer) {
    // 5b. Create a RP-client which can initiate an OIDC flow
    var client = new oidcIssuer.Client({
      client_id: process.env.client_id,
      client_secret: process.env.client_secret,
      redirect_uris: ["http://localhost:8080/login/callback"],
      response_types: ['code'],
      token_endpoint_auth_method: 'client_secret_post'
    });

    // 5c. Provide this strategy to the passport middleware
    passport.use(
      'affinidi-login', new Strategy({ client, passReqToCallback: true }, (req, tokenSet, userinfo, done) => {
        req.session.tokenSet = tokenSet;
        req.session.userinfo = userinfo;
        return done(null, tokenSet.claims());
      }));
  });

  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
