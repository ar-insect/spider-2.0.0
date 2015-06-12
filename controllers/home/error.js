/*
 * 统一错误处理
 */
exports.none = function (req, res) {
  res.render('home/404', {
    hello: '这是mockdata数据。。。'
  });
};