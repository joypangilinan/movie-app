const apiRoute = require('./apis');
const publicRoute = require('./apis/public');

const init = (server) => {
    server.get('*', function (req, res, next) {
        console.log('Request was made to: ' + req.originalUrl);
        return next();
    });

    server.use('/movies', apiRoute);
    server.use('/', publicRoute)
}
module.exports = {
    init: init
};