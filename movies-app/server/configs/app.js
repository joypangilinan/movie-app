const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')
// var path = require('path');
// var cookieParser = require('cookie-parser');
var session = require('express-session');
var dotenv = require('dotenv');
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');
// var flash = require('connect-flash');
// const jwt = require('express-jwt');

// // Configure Passport to use Auth0
// var strategy = new Auth0Strategy(
//     {
//         domain: 'backend-wc.auth0.com',
//         clientID: 'Su9RL6fywbsFctBpE7IUU4L8ucdmLSix',
//         clientSecret: 'RLxE_aG9DLAm_lNbs_2d43y50EX4OZK6grxUVVtsVetGO4p9C8o1t2Z0GWAZWnEa',
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

module.exports = function () {
    let server = express(),
        create,
        start;

    create = (config, db) => {
        let routes = require('../routes');

        // set all the server things
        server.set('env', config.env);
        server.set('port', config.port);
        server.set('hostname', config.hostname);

        // server.use(logger('dev'));
        // server.use(cookieParser());
        // add middleware to parse the json
        server.use(bodyParser.json())
        server.use(bodyParser.urlencoded({
            extended: false
        }));

        const corsOptions = {
            origin: 'http://localhost:3000'
        };

        server.use(cors(corsOptions));
        // var sess = {
        //     secret: 'CHANGE THIS TO A RANDOM SECRET',
        //     cookie: {},
        //     resave: false,
        //     saveUninitialized: true
        // }

        // if (server.get('env') === 'production') {
        //     sess.cookie.secure = true; // serve secure cookies, requires https
        // }

        // server.use(flash());

        // // Handle auth failure error messages
        // server.use(function (req, res, next) {
        //     if (req && req.query && req.query.error) {
        //         req.flash('error', req.query.error);
        //     }
        //     if (req && req.query && req.query.error_description) {
        //         req.flash('error_description', req.query.error_description);
        //     }
        //     next();
        // });

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

