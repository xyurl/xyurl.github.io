const https = require('https');
const url = require('url');
const querystring = require('querystring');
// 定义请求处理函数
function handleRequest(req, res) {
  // 从请求URL中获取query参数并转化为对象
  const query = url.parse(req.url).query;
  const dkey = querystring.parse(query);
  // 构造预检请求URL
  const precheckUrl = https://cowtransfer.com/core/api/transfer/share/precheck?downloadCode=${dkey.key};
  // 发送预检请求
  https.get(precheckUrl, function(res) {
    let body = '';
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      // 将预检请求结果转化为对象
      const ukey = JSON.parse(body);
      // 构造分享请求URL
      const shareUrl = https://cowtransfer.com/core/api/transfer/share?uniqueUrl=${ukey.data.uniqueUrl};
      // 发送分享请求
      https.get(shareUrl, function(res) {
        let body = '';
        res.on('data', function(chunk) {
          body += chunk;
        });
        res.on('end', function() {
          // 将分享请求结果转化为对象
          const data = JSON.parse(body);
          // 将客户端重定向至文件下载链接
          res.writeHead(301, {
            'Location': data.firstFile.firstFile.file_info.origin_url
          });
          res.end();
        });
      });
    });
  });
}
// 创建https服务器并监听8080端口
https.createServer(handleRequest).listen(8080);
console.log('Server running at http://localhost:8080/');
