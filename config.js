/*
 * 站点配置
 */
var path = require('path');
var pkg = require('./package.json');
var _ = require('lodash');

var config = {
    debug: true,
    name: 'sprider development resources',
    ui: {
        css: '',
        js: '',
        head: '',
        foot: '',
        title: '',
        charset: '',
        __style: '',
        __script: ''
    },
    /*
     * 默认模板引擎为`jade`
     * 请自行修改模板引擎配置
     * 注意：主要修改`name` `engine` `extension`
     */
    template: {
        name: 'jade',
        engine: require('jade'), // 模板引擎
        extension: 'jade',
        callback: function() {
            var call = arguments[0];
            return _.isFunction(call) ? call : _.noop;
        }
    },
    /*
    template: {
        name: 'velocity',
        engine: require('velocityjs'), // 模板引擎
        extension: 'vm',
        callback: function() {
            var fn = function() {};
            var call = arguments[0];
            return _.isFunction(call) ? call : fn;
        }
    },
    */
    version: pkg.version,
    // site sittings
    host: '10.63.73.38',
    assetsServer: '', // 静态文件存储域名
    charset: 'UTF-8',
    keywords: 'front local development resources..',
    description: 'front local development resources',
    port: 3000
};

module.exports = config;
module.exports.config = config;
