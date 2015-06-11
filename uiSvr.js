// var sys = require('sys');
var fs = require('fs');
var _ = require('lodash');
//var cwd = process.cwd();
var config = require('./config');
// default ui config
var uiConfig = config.ui;

function inline(module, page) {
    var embed = {};
    var cssSource, jsSource;
    var path = 'views/ui/' + module + '/';
    try {
        cssSource = fs.readFileSync(path + page + '.css', 'utf-8');
        embed['__style'] = cssSource;
    } catch(e) {
        embed['__style'] = '';
    }
    try {
        jsSource = fs.readFileSync(path + page + '.js', 'utf-8');
        embed['__script'] = jsSource;
    } catch(e) {
        embed['__script'] = '';
    }
    return embed;
}

function getKey(path) {
    var __key;
    if (path && _.isString(path)) {
        __key = path.replace(new RegExp('^.*[\\\\/]templates[\\\\/](.+)[\\\\/]screen[\\\\/](.+)\.' + config.template.extension +'$'), '$1,$2');
    }
    return __key;
}

function putOn(resource, type) {
    var str = '';
    if ('css' === type) {
        resource.forEach(function(item) {
            str += '<link rel="stylesheet" href="/assets/' + item + '" />\n';
        });
    } else if ('js' === type) {
        resource.forEach(function(item) {
            str += '<script src="/assets/' + item + '"></script>\n';
        });
    }
    return str;
}

function readJson(module) {
    var source;
    var path = module === undefined ?
                'views/ui/config' : 'views/ui/' + module;
    try {
        source = fs.readFileSync(path + '/config.json','utf-8');
        return JSON.parse( source );
    } catch(e) {
        return null;
        // throw new Error(e);
    }
}

function getModule(key) {
    return key ? key.replace(/[\\]/g, '/').split(',') : [];
}

function parseConfig(key) {
    var tempobj;
    var css, js;
    var i, j, k, tgc = {}, tc = {};
    var mp = getModule(key);
    var module, page, config, globalConfig;
    module = mp[0];
    page = mp[1];
    globalConfig = readJson();
    config = readJson(module);
    if (globalConfig) {
        for (i in globalConfig) {
            if ('vars' === i) {
                for (j in globalConfig[i]) {
                    tgc[j] = globalConfig[i][j];
                }
                continue;
            }
            tgc[i] = globalConfig[i];
        }
    }
    if (config) {
        for (i in config) {
            if ('default' === i) {
                // css, js, head, foot and other vars.
                for (j in config[i]) {
                    if ('vars' === j) {
                        for (k in config[i][j]) {
                             tc[k] = config[i][j][k];
                        }
                        continue;
                    }
                    tc[j] = config[i][j];
                }
            }
            if ('page' === i) {
                if (config[i][page]) {
                    // this page config
                    for (k in config[i][page]) {
                        if ('css' === k || 'js' === k) {
                            // combo css & js
                            if (tc[k]) {
                                tc[k] = tc[k].concat( config[i][page][k] );
                                //delete tc[k];
                                continue;
                            }
                        }
                        if ('vars' === k) {
                            for (j in config[i][page][k]) {
                                tc[j] = config[i][page][k][j];
                            }
                            continue;
                        }
                        // head, foot and other vars.
                        tc[k] = config[i][page][k];
                    }
                }
            }
        }
    }
    // combo page inline css and js
    // __style, __script
    _.merge( tc, inline(module, page) );

    if (tc['css']) {
        tgc['css'] = tgc['css'].concat( tc['css'] );
        delete tc['css'];
    }

    if (tc['js']) {
        tgc['js'] = tgc['js'].concat( tc['js'] );
        delete tc['js'];
    }

    tempobj = _.extend(tgc, tc);

    tempobj['js'] = tempobj['js'] ? putOn(tempobj['js'], 'js') : '';
    tempobj['css'] = tempobj['css'] ? putOn(tempobj['css'], 'css') : '';

    if (tempobj['__style'].trim() !== '') {
        tempobj['__style'] = '<style>\n' + tempobj['__style'] + '\n</style>';
    }

    if (tempobj['__script'].trim() !== '') {
        tempobj['__script'] = '<script>\n' + tempobj['__script'] + '\n</script>';
    }

    if (!tempobj['layout']) {
        tempobj['layout'] = 'default';
    }

    if (!tempobj['head']) {
        tempobj['head'] = 'theme/default';
    }

    if (!tempobj['foot']) {
        tempobj['foot'] = 'theme/default';
    }

    return tempobj;
}

var uiObject = {
    config: function(path) {
        var key = getKey(path);
        if (key === undefined) return uiConfig;
        var __obj = parseConfig(key);
        uiConfig = _.extend(uiConfig, __obj);
        uiConfig = _.merge(uiConfig, {
            __head: uiConfig.head,
            __screen: '',
            __foot: uiConfig.foot,
            module: getModule(key)[0],
            body: getModule(key)[1],
            layout: uiConfig.layout,
            keywords: config.keywords,
            description: config.description
        });
        return uiConfig;
    },
    util : {
        replaceWith: function(tpl, sub) {
            var i = 0;
            var symbol = '*';
            var str = tpl;
            if (_.isString(sub)) {
                return str.replace(symbol, sub);
            }
            if (_.isArray(sub)) {
                while (i < sub.length) {
                    var p = str.indexOf(symbol);
                    var l = symbol.length;
                    var h = str.substring(0, p);
                    var f = str.substring(p+l);
                    str = h + sub[i] + f;
                    i++;
                }
                return str;
            }
            return '';
        },
        getHead: function(str) {
            var tpl = 'views/ui/*/head.' + config.template.extension;
            return this.replaceWith(tpl, str);
        },
        getScreen: function(str) {
            var tpl = 'views/templates/*/screen/*.' + config.template.extension;
            return this.replaceWith(tpl, str);
        },
        getFoot: function(str) {
            var tpl = 'views/ui/*/foot.' + config.template.extension;
            return this.replaceWith(tpl, str);
        },
        getLayout: function(str) {
            var tpl = '*/views/templates/*/layout/*.' + config.template.extension;
            return this.replaceWith(tpl, str);
        }
    }
};

module.exports = uiObject;
