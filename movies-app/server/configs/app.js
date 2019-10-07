const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var session = require('express-session');
var dotenv = require('dotenv');
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

module.exports = function () {
    let server = express(),
        create,
        start;

    create = (config, db) => {
        let routes = require('../routes');

        // dotenv.config();

        // // Configure Passport to use Auth0
        // var strategy = new Auth0Strategy(
        //     {
        //         domain: process.env.AUTH0_DOMAIN,
        //         clientID: process.env.AUTH0_CLIENT_ID,
        //         clientSecret: process.env.AUTH0_CLIENT_SECRET,
        //         callbackURL:
        //             process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
        //     },
        //     function (accessToken, refreshToken, extraParams, profile, done) {
        //         // accessToken is the token to call Auth0 API (not needed in the most cases)
        //         // extraParams.id_token has the JSON Web Token
        //         // profile has all the information from the user
        //         return done(null, profile);
        //     }
        // );

        // passport.use(strategy);

        // // You can use this section to keep a smaller payload
        // passport.serializeUser(function (user, done) {
        //     done(null, user);
        // });

        // passport.deserializeUser(function (user, done) {
        //     done(null, user);
        // });

        // set all the server things
        server.set('env', config.env);
        server.set('port', config.port);
        server.set('hostname', config.hostname);

        // add middleware to parse the json
        server.use(bodyParser.json())
        server.use(bodyParser.urlencoded({
            extended: false
        }));

        // config express-session
        // var sess = {
        //     secret: 'CHANGE THIS TO A RANDOM SECRET',
        //     cookie: {},
        //     resave: false,
        //     saveUninitialized: true
        // }

        // if (server.get('env') === 'production') {
        //     sess.cookie.secure = true; // serve secure cookies, requires https
        // }

        // app.use(session(sess));

        const { connection } = mongoose
        //connect the database
        mongoose.connect(
            db.database,
            {
                useNewUrlParser: true,
                useCreateIndex: true
            }
        );

        // Set up routes
        routes.init(server);
    };


    start = () => {
        let hostname = server.get('hostname'),
            port = server.get('port');
        server.listen(port, function () {
            console.log('Express server listening on - http://' + hostname + ':' + port);
        });
    };
    return {
        create: create,
        start: start
    };
};

