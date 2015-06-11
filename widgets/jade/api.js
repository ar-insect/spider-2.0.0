var config = require('../../config');
var ui = require('../../ui');
var cwd = process.cwd();
var fs = require('fs');
var _ = require('lodash');

module.exports = function(path, options, func) {
    try {
        var filepath;
        var jadeString;
        var glue;
        var uiConfig = ui.config(path);
        var module = uiConfig.module;
        var body = uiConfig.body;
        var layout = uiConfig.layout;
        var jade = config.template.engine;
        uiConfig.__head = ui.util.getHead(uiConfig.__head);
        uiConfig.__screen = ui.util.getScreen([module, body]);
        uiConfig.__foot = ui.util.getFoot(uiConfig.__foot);
        // 转换相对路径，因为jade读取模板需要相对路径
        uiConfig.__head = uiConfig.__head.replace(/^(views\/)(\S*)$/, '../../../../$2');
        uiConfig.__screen = '../' + uiConfig.__screen.substr(uiConfig.__screen.lastIndexOf('screen'));
        uiConfig.__foot = uiConfig.__foot.replace(/^(views\/)(\S*)$/, '../../../../$2');
        glue = _.merge({ ui: uiConfig }, options);
        // TODO: 处理内联脚本
        //uiConfig.__script = jade.render(uiConfig.__script, glue);
        filepath = ui.util.getLayout([cwd, module, layout]);
        try {
            //jadeString = fs.readFileSync(filepath).toString();
            //func(null, jade.render(jadeString, glue));
            // mark：不能用fs.readFileSync读取字符流，需要用jade.renderFile否则include出不来。（不知何原因？）
            func(null, jade.renderFile(filepath, glue));
        } catch (e) {
        }
    } catch (err) {
        console.log(err);
        func(err);
    }
};