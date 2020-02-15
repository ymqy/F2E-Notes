# 目录

- 代理 https GET 请求
- 代理 https POST 请求
- 代理 http GET 请求
- 代理 http POST 请求


## 代理 https GET 请求

```javascript
var https = require('https');
var HttpsProxyAgent = require('https-proxy-agent');

var proxy = 'http://127.0.0.1:6666';
var agent = new HttpsProxyAgent(proxy);
var req = https.request({
	host: 'twitter.com',
	port: '443',
	path: '/api',
	method: 'GET',
	agent: agent,
	timeout: 10000,
	followRedirect: true,
	maxRedirects: 10
}, function(res) {
	res.setEncoding('utf8');
	res.on('data', function(chunk) {
		console.log('Response: ' + chunk);
	});
});

req.end();
```

## 代理 https POST 请求

```javascript

```

## 代理 http GET 请求

```javascript

```

## 代理 http POST 请求

```javascript

```


## 参考

- [Node JS: Making https request via proxy](https://codingmiles.com/node-js-making-https-request-via-proxy/)
