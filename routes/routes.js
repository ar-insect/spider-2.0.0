/**
 * Module dependencies.
 */
var home = require('../controllers/home'); // default index.js
var errorhandler = require('../controllers/home/error');
// more controllers define here.
// ...

module.exports = function(app) {
    // home
    app.get('/', home.index);

    // 404 page warn: must in the last
    app.get('*', errorhandler.none);
};