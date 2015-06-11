var config = require('../config');

exports.render = function (req, res, next) {
    var _render = res.render;
    res.render = function(view, options, callback) {
        var s = view.replace(/[\/\\]/g, '/');
        var pre = s.substring(0,s.indexOf('/'));
        var end = s.substring(s.indexOf('/'));
        view = pre + '/screen' + end + '.' + config.template.extension;
        _render.call(res, view, options, callback);
    };
    next();
};