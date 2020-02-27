# 目录

## p-limit

```javascript
const pLimit = require('p-limit');

const limit = pLimit(1);

const input = [
	limit(() => fetchSomething('foo')),
	limit(() => fetchSomething('bar')),
	limit(() => doSomething())
];

(async () => {
	// Only one promise is run at once
	const result = await Promise.all(input);
	console.log(result);
})();
```

## 参考

- [sindresorhus/p-limit](https://github.com/sindresorhus/p-limit) - Run multiple promise-returning & async functions with limited concurrency
