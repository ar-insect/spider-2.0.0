var config = require('../../config');
var ui = require('../uiSvr');
var cwd = process.cwd();
//var fs = require('fs');
var _ = require('lodash');

module.exports = function(path, options, func) {
    try {
        var filepath;
        var glue;
        var uiConfig = ui.config(path);
        var module = uiConfig.module;
        var body = uiConfig.body;
        var layout = uiConfig.layout;
        var jade = config.template.engine;
        uiConfig.__head = ui.util.getHead(uiConfig.__head);
        uiConfig.__screen = ui.util.getScreen([module, body]);
        uiConfig.__foot = ui.util.getFoot(uiConfig.__foot);
        glue = _.merge({ ui: uiConfig }, options);
        // TODO: 处理内联脚本
        //uiConfig.__script = jade.render(uiConfig.__script, glue);
        // 因为jade不支持在模板中include variable所以要在此处直接处理掉
        uiConfig.__head = jade.renderFile(uiConfig.__head, glue);
        uiConfig.__screen = jade.renderFile(uiConfig.__screen, glue);
        uiConfig.__foot = jade.renderFile(uiConfig.__foot, glue);
        filepath = ui.util.getLayout([cwd, module, layout]);
        try {
            // mark：不能用fs.readFileSync读取字符流，需要用jade.renderFile
            func(null, jade.renderFile(filepath, glue));
        } catch (e) {
        }
    } catch (err) {
        console.log(err);
        func(err);
    }
};