/*******
* server.js file
********/

const server = require('./server/configs/app')();
const config = require('./server/configs/config/config');
const db = require('./server/configs/db');

//create the basic server setup 
server.create(config, db);

//start the server
server.start();
