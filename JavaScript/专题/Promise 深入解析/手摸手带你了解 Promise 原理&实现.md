## 目录

- 什么是 Promise？
- 术语一览
- 使用指北
- 原理与实现
- 总结

## 什么是 Promise？

*Promise 是 JS 异步编程中的重要概念，是目前比较流行 Javascript 异步编程解决方案之一，但不是终极异步解决方*

Promise 本意为许诺，向朋友许诺了一件事情，被许诺的一方，会等待事情的结果，结果可能是做到了，也可能是没做到，做到了就是做到了，没做到就是没做到，结果不能再改变。

## 术语一览

*现在假设有一对 cp 👫，男友向女票许下了一个承诺，男友会为了实现承诺而付出实际行动（💡），过程中或许会发生意外，因为某些无法抗拒的原因（💡）导致承诺无法兑现（💡），或者过程很顺利，以好的结果（💡）兑现了承诺（💡），如果男友兑现了承诺，女票会做出高兴的反应（💡），如果没有兑现，女票可能会咬你了（💡）。*

当然还要包括承诺的状态（💡）。

上面的 11 个 💡 分别对应着 Promise 中的：

- executor - 男友兑现承诺的过程
- reason - 男友无法兑现承诺的原因
- reject - 男友定下无法兑现的结论
- value - 男友可以兑现承诺的结果
- resolve - 男友定下可以兑现的结论
- onFulfilled - 兑现了承诺，女票的反应
- onRejected - 没有兑现承诺，女票的反应
- status
  - pending - 等待兑现承诺中
  - fulfilled - 兑现了承诺
  - rejected - 无法兑现承诺

抛个伪代码做个类比

```javascript
const executor = (resolve, reject) => {
  resolve(value);
  reject(reason);
};
const p = new Promise(executor).then(onFulfilled, onRejected);
```

最后还要补充一个，那就是 thenable 对象，定义了 then 方法的函数或对象，then 方法符合 Promise 规范，这与 Promise 对象很像。

## 使用指北

### 同步基本用法

```javascript
const p = new Promise((resolve, reject) => {
  console.log("去做承诺的事情");
  const luckyNumber = Math.random();
  if (luckyNumber > 0.5) {
    resolve("做好了");
  }
  reject("做不好了");
});

p.then(
  value => {
    console.log("TA 做到了，因为", value);
  },
  reason => {
    console.log("TA 没做到，因为", reason);
  }
);

/* 
打印结果：

去做承诺的事情
TA 没做到，因为 做不好了 
or
去做承诺的事情
TA 做到了，因为 做好了
*/
```

### 异步基本用法

```javascript
const p = new Promise((resolve, reject) => {
  console.log("去做承诺的事情");
  // 使用 setTimeout 表示执行异步操作
  setTimeout(() => {
    const luckyNumber = Math.random();
    if (luckyNumber > 0.5) {
      resolve("做好了");
    }
    reject("做不好了");
  }, 1000);
});

p.then(
  value => {
    console.log("Success", value);
  },
  reason => {
    console.log("Fail", reason);
  }
);

/* 
打印结果：

去做承诺的事情
Success 做好了
or
去做承诺的事情
Fail 做不好了
*/
```

### 同步错误捕获

```javascript
const p = new Promise((resolve, reject) => {
  console.log("去做承诺的事情");
  throw new Error("发生意外情况。");
  resolve("做好了");
});

p.then(
  value => {
    console.log("Success", value);
  },
  reason => {
    console.log("Fail", reason);
  }
);

/* 
打印结果：

去做承诺的事情
Fail Error: 发生意外情况。
    at Promise (/Users/yeming/Develop/Github/Blog/201907/tempCodeRunnerFile.js:3:9)
    at new Promise (<anonymous>)
    at Object.<anonymous> (/Users/yeming/Develop/Github/Blog/201907/tempCodeRunnerFile.js:1:73)
    at Module._compile (internal/modules/cjs/loader.js:701:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:712:10)
    at Module.load (internal/modules/cjs/loader.js:600:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:539:12)
    at Function.Module._load (internal/modules/cjs/loader.js:531:3)
    at Function.Module.runMain (internal/modules/cjs/loader.js:754:12)
    at startup (internal/bootstrap/node.js:283:19)
*/
```

### 异步函数内部错误无法捕获

```javascript
const p = new Promise((resolve, reject) => {
  console.log("去做承诺的事情");
  setTimeout(() => {
    throw new Error("发生意外情况。");
    resolve("做好了");
  }, 1000);
});

p.then(
  value => {
    console.log("Success", value);
  },
  reason => {
    console.log("Fail", reason);
  }
);

/*
打印结果:

去做承诺的事情
/Users/yeming/Develop/Github/Blog/201907/tempCodeRunnerFile.js:4
    throw new Error('发生意外情况。')
    ^

Error: 发生意外情况。
    at Timeout.setTimeout [as _onTimeout] (/Users/yeming/Develop/Github/Blog/201907/tempCodeRunnerFile.js:4:11)
    at ontimeout (timers.js:436:11)
    at tryOnTimeout (timers.js:300:5)
    at listOnTimeout (timers.js:263:5)
    at Timer.processTimers (timers.js:223:10)
*/
```

### 链式调用，onFulfilled\onRejected 返回基本类型值，会走成功函数

```javascript
const p = new Promise((resolve, reject) => {
  console.log("去做承诺的事情");
  const luckyNumber = Math.random();
  if (luckyNumber > 0.5) {
    resolve("做好了");
  }
  reject("做不好了");
})
  .then(
    value => {
      console.log("Success", value);
      return "高兴";
    },
    reason => {
      console.log("Fail", reason);
      return "难受";
    }
  )
  .then(
    value => {
      console.log("返回值 value", value);
    },
    reason => {
      console.log("返回值 reason", reason);
    }
  );

/*
打印结果:

去做承诺的事情
Success 做好了
返回值 value 高兴
or
去做承诺的事情
Fail 做不好了
返回值 value 难受
*/
```

### 链式调用，onFulfilled\onRejected 中抛出异常

```javascript
const p = new Promise((resolve, reject) => {
  console.log("去做承诺的事情");
  reject("做不好了");
})
  .then(
    value => {
      console.log("Success", value);
      return "高兴";
    },
    reason => {
      console.log("Fail", reason);
      // throw new Error('难受')
      return new Error("难受");
    }
  )
  .then(
    value => {
      console.log("返回值 value", value);
    },
    reason => {
      console.log("返回值 reason", reason);
    }
  );

/*
打印结果:

去做承诺的事情
Fail 做不好了
返回值 reason Error: 难受
    at Promise.then.reason (/Users/yeming/Develop/Github/Blog/201907/tempCodeRunnerFile.js:13:10)
    at process._tickCallback (internal/process/next_tick.js:68:7)
    at Function.Module.runMain (internal/modules/cjs/loader.js:757:11)
    at startup (internal/bootstrap/node.js:283:19)
    at bootstrapNodeJSCore (internal/bootstrap/node.js:622:3)
*/
```

### 链式调用，onFulfilled\onRejected 返回 Promise.resolve\Promise.resolve

```javascript
const p = new Promise((resolve, reject) => {
  console.log("去做承诺的事情");
  const luckyNumber = Math.random();
  if (luckyNumber > 0.5) {
    resolve("做好了");
  }
  reject("做不好了");
})
  .then(
    value => {
      console.log("Success", value);
      return Promise.resolve("高兴");
    },
    reason => {
      console.log("Fail", reason);
      return Promise.reject("难受");
    }
  )
  .then(
    value => {
      console.log("返回值 value", value);
    },
    reason => {
      console.log("返回值 reason", reason);
    }
  );

/*
打印结果:

去做承诺的事情
Fail 做不好了
返回值 reason 难受
or
去做承诺的事情
Success 做好了
返回值 value 高兴
*/
```

### 链式调用，onFulfilled\onRejected 值的穿透

```javascript
const p = new Promise((resolve, reject) => {
  console.log("去做承诺的事情");
  const luckyNumber = Math.random();
  if (luckyNumber > 0.5) {
    resolve("做好了");
  }
  reject("做不好了");
})
  .then()
  .then()
  .then(
    value => {
      console.log("Success", value);
      return Promise.resolve("高兴");
    },
    reason => {
      console.log("Fail", reason);
      return Promise.reject("难受");
    }
  )
  .then(
    value => {
      console.log("返回值 value", value);
    },
    reason => {
      console.log("返回值 reason", reason);
    }
  );

/*
打印结果:

去做承诺的事情
Success 做好了
返回值 value 高兴
or
去做承诺的事情
Fail 做不好了
返回值 reason 难受
*/
```

### 链式调用，onFulfilled\onRejected 返回一个异步 Promise

```javascript
const p = new Promise((resolve, reject) => {
  console.log("去做承诺的事情");
  const luckyNumber = Math.random();
  if (luckyNumber > 0.5) {
    resolve("做好了");
  }
  reject("做不好了");
})
  .then(
    value => {
      console.log("Success", value);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("做好了");
        }, 1000);
      });
    },
    reason => {
      console.log("Fail", reason);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject("做不好了");
        }, 1000);
      });
    }
  )
  .then(
    value => {
      console.log("返回值 value", value);
    },
    reason => {
      console.log("返回值 reason", reason);
    }
  );

/*
打印结果:

去做承诺的事情
Fail 做不好了
返回值 reason 做不好了
or
去做承诺的事情
Success 做好了
返回值 value 高兴
*/
```

### 链式调用，resolve 传入 Promise, 执行器中的 resolve 传入 Promise

```javascript
const p = new Promise((resolve1, reject1) => {
  console.log("去做承诺的事情");
  const luckyNumber = Math.random();
  if (luckyNumber > 0.5) {
    resolve1(
      new Promise((resolve2, reject2) => {
        resolve2("做好了");
      })
    );
  }
  resolve1(
    new Promise((resolve2, reject2) => {
      reject2("做不好了");
    })
  );
})
  .then(
    value => {
      console.log("Success", value);
      return new Promise((resolve1, reject1) => {
        resolve1(
          new Promise((resolve2, reject2) => {
            setTimeout(() => {
              resolve2("高兴");
            }, 1000);
          })
        );
      });
    },
    reason => {
      console.log("Fail", reason);
      return new Promise((resolve1, reject1) => {
        resolve1(
          new Promise((resolve2, reject2) => {
            setTimeout(() => {
              reject2("难受");
            }, 1000);
          })
        );
      });
    }
  )
  .then(
    value => {
      console.log("返回值 value", value);
    },
    reason => {
      console.log("返回值 reason", reason);
    }
  );

/*
打印结果:

去做承诺的事情
Fail 做不好了
返回值 reason 难受
or
去做承诺的事情
Success 做好了
返回值 value 高兴
*/
```

### 链式调用，resolve 多层嵌套 Promise，状态由最内层状态决定

```javascript
const p = new Promise((resolve, reject) => {
  console.log("去做承诺的事情");
  const luckyNumber = Math.random();
  if (luckyNumber > 0.5) {
    resolve("做好了");
  }
  reject("做不好了");
})
  .then(
    value => {
      console.log("Success", value);
      return new Promise((resolve1, reject1) => {
        resolve1(
          new Promise((resolve2, reject2) => {
            resolve2(
              new Promise((resolve3, reject3) => {
                resolve3(
                  new Promise((resolve4, reject4) => {
                    setTimeout(() => {
                      resolve4("高兴");
                    }, 1000);
                  })
                );
              })
            );
          })
        );
      });
    },
    reason => {
      console.log("Fail", reason);
      return new Promise((resolve1, reject1) => {
        resolve1(
          new Promise((resolve2, reject2) => {
            resolve2(
              new Promise((resolve3, reject3) => {
                resolve3(
                  new Promise((resolve4, reject4) => {
                    setTimeout(() => {
                      reject4("难受");
                    }, 1000);
                  })
                );
              })
            );
          })
        );
      });
    }
  )
  .then(
    value => {
      console.log("返回值 value", value);
    },
    reason => {
      console.log("返回值 reason", reason);
    }
  );

/*
打印结果:

去做承诺的事情
Fail 做不好了
返回值 reason 难受
or
去做承诺的事情
Success 做好了
返回值 value 高兴
*/
```

### 链式调用，同一个 Promise 对象多次调用 then 方法

```javascript
const p = new Promise((resolve, reject) => {
  console.log("去做承诺的事情");
  const luckyNumber = Math.random();
  if (luckyNumber > 0.5) {
    resolve("做好了");
  }
  reject("做不好了");
});

p.then(
  value => {
    console.log("返回值 value", value);
  },
  reason => {
    console.log("返回值 reason", reason);
  }
);

p.then(
  value => {
    console.log("返回值 value", value);
  },
  reason => {
    console.log("返回值 reason", reason);
  }
);

/*
打印结果:

去做承诺的事情
返回值 value 做好了
返回值 value 做好了
or
去做承诺的事情
返回值 reason 做不好了
返回值 reason 做不好了
*/
```

### 链式调用，p 对象是 then 方法返回的 Promise 对象

```javascript
const p = new Promise((resolve, reject) => {
  console.log("去做承诺的事情");
  const luckyNumber = Math.random();
  if (luckyNumber > 0.5) {
    resolve("做好了");
  }
  reject("做不好了");
}).then(
  value => {
    console.log("返回值 value", value);
  },
  reason => {
    console.log("返回值 reason", reason);
  }
);

p.then(
  value => {
    console.log("out 返回值 value", value);
  },
  reason => {
    console.log("out 返回值 reason", reason);
  }
);

/*
打印结果:

去做承诺的事情
返回值 value 做好了
out 返回值 value undefined
or
去做承诺的事情
返回值 reason 做不好了
out 返回值 value undefined
*/
```

### 链式调用中的循环引用

```javascript
let p1 = new Promise((resolve, reject) => {
  resolve(1000);
});
let p2 = p1.then(() => p2);
p2.then(null, err => console.log(err));

/*
打印结果:

TypeError: Chaining cycle detected for promise #<Promise>
    at process._tickCallback (internal/process/next_tick.js:68:7)
    at Function.Module.runMain (internal/modules/cjs/loader.js:757:11)
    at startup (internal/bootstrap/node.js:283:19)
    at bootstrapNodeJSCore (internal/bootstrap/node.js:622:3)
*/
```

### Promise 对象变成失败态之后如果不调用 then 的失败方法或者 catch 方法，会抛出一个错误，但是不会终止程序

```javascript
new Promise((resolve, reject) => {
  reject("做不到");
});
// .then(null, err => console.log("err", err));
setTimeout(() => {
  console.log("难受");
}, 1000);

/*
打印结果:

(node:38791) UnhandledPromiseRejectionWarning: 做不到
(node:38791) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
(node:38791) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
难受
*/
```

## 原理与实现

_源码实现会根据使用指北的例子逐步实现_

### 实现之前先丢个基本 Promise 源码框架

```javascript
"use strict";

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;

    const resolve = value => {};

    const reject = reason => {};

    // 一旦实例化 Promise 就会开始执行
    executor(resolve, reject);
  }

  then(onFulfilled, onRejected) {}
}

module.exports = Promise;
```

### 实现同步

```javascript
"use strict";

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;

    const resolve = value => {
      // 只有等待状态才能改变状态
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
      }
    };

    const reject = reason => {
      // 只有等待状态才能改变状态
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
      }
    };

    executor(resolve, reject);
  }

  // 传入 then 中的回调函数，是在执行 resolve\reject 之后才执行
  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value);
    }

    if (this.status === REJECTED) {
      onRejected(this.reason);
    }
  }
}

module.exports = Promise;
```

如果传入 then 中的回调函数，是在执行 resolve\reject 之前执行呢？

### 异步实现

```javascript
"use strict";

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    // 待执行函数队列
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        // 状态发生改变，依次调用队列中的待执行函数
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };

    const reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        // 状态发生改变，依次调用队列中的待执行函数
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    executor(resolve, reject);
  }

  then(onFulfilled, onRejected) {
    // 因为 resolve\reject 可能会异步执行，当调用 onFulfilled\onRejected 时，可能还是等待态，需要将待执行函数保存到队列中，等状态改变后，再按顺序调用
    if (this.status === PENDING) {
      this.onFulfilledCallbacks.push(() => {
        onFulfilled(this.value);
      });
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason);
      });
    }

    if (this.status === FULFILLED) {
      onFulfilled(this.value);
    }

    if (this.status === REJECTED) {
      onRejected(this.reason);
    }
  }
}

module.exports = Promise;
```

如果用户定义的执行器运行时发生错误呢？

### 执行器内部错误捕获

```javascript
"use strict";

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };

    const reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    // 增加错误捕获
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    if (this.status === PENDING) {
      this.onFulfilledCallbacks.push(() => {
        onFulfilled(this.value);
      });
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason);
      });
    }

    if (this.status === FULFILLED) {
      onFulfilled(this.value);
    }

    if (this.status === REJECTED) {
      onRejected(this.reason);
    }
  }
}

module.exports = Promise;
```

如果想链式多次调用 then 呢？

### 链式调用，onFulfilled\onRejected 返回基本类型值

```javascript
"use strict";

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };

    const reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    // 每次调用 then 都会返回一个新的 Promise 对象
    const promise2 = new Promise((resolve, reject) => {
      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(() => {
          const x = onFulfilled(this.value);
          // onFulfilled 返回一个普通值，新的 Promise 对象状态变为成功态
          resolve(x);
        });
        this.onRejectedCallbacks.push(() => {
          const x = onRejected(this.reason);
          // onRejected 返回一个普通值，新的 Promise 对象状态变为成功态
          resolve(x);
        });
      }

      if (this.status === FULFILLED) {
        const x = onFulfilled(this.value);
        // onFulfilled 返回一个普通值，新的 Promise 对象状态变为成功态
        resolve(x);
      }

      if (this.status === REJECTED) {
        const x = onRejected(this.reason);
        // onRejected 返回一个普通值，新的 Promise 对象状态变为成功态
        resolve(x);
      }
    });

    return promise2;
  }
}

module.exports = Promise;
```

如果执行 onFulfilled\onRejected 时发生错误异常呢？

### 链式调用，onFulfilled\onRejected 抛出异常

```javascript
"use strict";

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };

    const reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    const promise2 = new Promise((resolve, reject) => {
      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(() => {
          // 执行 onFulfilled 时可能会发生异常
          try {
            const x = onFulfilled(this.value);
            resolve(x);
          } catch (error) {
            // 发生错误时，新的 Promise 对象状态变为失败态
            reject(error);
          }
        });
        this.onRejectedCallbacks.push(() => {
          // 执行 onRejected 时可能会发生异常
          try {
            const x = onRejected(this.reason);
            resolve(x);
          } catch (error) {
            // 发生错误时，新的 Promise 对象状态变为失败态
            reject(error);
          }
        });
      }

      if (this.status === FULFILLED) {
        // 执行 onFulfilled 时可能会发生异常
        try {
          const x = onFulfilled(this.value);
          resolve(x);
        } catch (error) {
          // 发生错误时，新的 Promise 对象状态变为失败态
          reject(error);
        }
      }

      if (this.status === REJECTED) {
        // 执行 onRejected 时可能会发生异常
        try {
          const x = onRejected(this.reason);
          resolve(x);
        } catch (error) {
          // 发生错误时，新的 Promise 对象状态变为失败态
          reject(error);
        }
      }
    });

    return promise2;
  }
}

module.exports = Promise;
```

如果执行 onFulfilled\onRejected 时返回的不是普通值而是一个 Promise 对象呢？Promise 失败态和成功态分别又怎么处理呢？

### 链式调用，onFulfilled\onRejected 返回一个失败态\成功态 Promise

```javascript
"use strict";

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

const resolvePromise = (x, resolve, reject) => {
  // 判断 x 是一个 Promise 对象或者是一个 thenable 对象
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    // x 对象的状态决定 promise2 的状态
    x.then(value => resolve(value), reason => reject(reason));
  } else {
    // x 是一个普通值，promise2 的状态变为成功态
    return resolve(x);
  }
};

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };

    const reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    const promise2 = new Promise((resolve, reject) => {
      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(() => {
          // 当前事件循环中并不能访问到 promise2 对象，但可以在下次事件循环中访问，需要使用宏任务
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              // x 可能会是一个 Promise 对象，用来决定 promise2 的状态，所以要传入 promise2 的 resolve、reject 方法
              resolvePromise(x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          // 当前事件循环中并不能访问到 promise2 对象，但可以在下次事件循环中访问，需要使用宏任务
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              // x 可能会是一个 Promise 对象，用来决定 promise2 的状态，所以要传入 promise2 的 resolve、reject 方法
              resolvePromise(x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }

      if (this.status === FULFILLED) {
        // 当前事件循环中并不能访问到 promise2 对象，但可以在下次事件循环中访问，需要使用宏任务
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            // x 可能会是一个 Promise 对象，用来决定 promise2 的状态，所以要传入 promise2 的 resolve、reject 方法
            resolvePromise(x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      if (this.status === REJECTED) {
        // 当前事件循环中并不能访问到 promise2 对象，但可以在下次事件循环中访问，需要使用宏任务
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            // x 可能会是一个 Promise 对象，用来决定 promise2 的状态，所以要传入 promise2 的 resolve、reject 方法
            resolvePromise(x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
    });

    return promise2;
  }
}

module.exports = Promise;
```

Promise/A+ 规范中定义了 onFulfilled 和 onRejected 是可选参数，那应该如何实现呢？

### then 普通值和错误透传

```javascript
"use strict";

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

const resolvePromise = (x, resolve, reject) => {
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    x.then(value => resolve(value), reason => reject(reason));
  } else {
    return resolve(x);
  }
};

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };

    const reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    // onFulfilled, onRejected 是可选参数，需要特别处理
    // 成功函数需要正常返回值，哪怕是 error，实现值透传
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    // 失败函数需要把值以 throw 的形式抛出错误，实现错误值透传
    onRejected = typeof onRejected === 'function' ?
      ? onRejected
      : error => {
          throw error;
        };
    const promise2 = new Promise((resolve, reject) => {
      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }

      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
    });

    return promise2;
  }
}

module.exports = Promise;
```

如果往 resolve 中传入 Promise 对象呢？

### 链式调用，resolve 传入 Promise

```javascript
"use strict";

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

const resolvePromise = (x, resolve, reject) => {
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    x.then(value => resolve(value), reason => reject(reason));
  } else {
    return resolve(x);
  }
};

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {
      // 判断传入的 value 是否是 Promise 对象
      if (value instanceof Promise) {
        return value.then(resolve, reject);
      }
      setTimeout(() => {
        if (this.status === PENDING) {
          this.status = FULFILLED;
          this.value = value;
          this.onFulfilledCallbacks.forEach(fn => fn(this.value));
        }
      }, 0);
    };

    const reject = reason => {
      setTimeout(() => {
        if (this.status === PENDING) {
          this.status = REJECTED;
          this.reason = reason;
          this.onRejectedCallbacks.forEach(fn => fn(this.reason));
        }
      }, 0);
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    // onFulfilled, onRejected 是可选参数，需要特别处理
    // 成功函数需要正常返回值，哪怕是 error，实现值透传
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : value => value;
    // 失败函数需要把值以 throw 的形式抛出错误，实现错误值透传
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : error => {
            throw error;
          };
    const promise2 = new Promise((resolve, reject) => {
      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(value => {
          try {
            const x = onFulfilled(value);
            resolvePromise(x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
        this.onRejectedCallbacks.push(reason => {
          try {
            const x = onRejected(reason);
            resolvePromise(x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }

      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
    });

    return promise2;
  }
}

module.exports = Promise;
```

### 循环引用检测

```javascript
"use strict";

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

const resolvePromise = (promise2, x, resolve, reject) => {
  // 判断 promise2 和 x 是否为同一个 Promise 对象
  if (promise2 === x) {
    return reject(
      new TypeError("TypeError: Chaining cycle detected for promise #<Promise>")
    );
  }
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    x.then(value => resolve(value), reason => reject(reason));
  } else {
    return resolve(x);
  }
};

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {
      // 判断传入的 value 是否是 Promise 对象
      if (value instanceof Promise) {
        return value.then(resolve, reject);
      }
      setTimeout(() => {
        if (this.status === PENDING) {
          this.status = FULFILLED;
          this.value = value;
          this.onFulfilledCallbacks.forEach(fn => fn(this.value));
        }
      }, 0);
    };

    const reject = reason => {
      setTimeout(() => {
        if (this.status === PENDING) {
          this.status = REJECTED;
          this.reason = reason;
          this.onRejectedCallbacks.forEach(fn => fn(this.reason));
        }
      }, 0);
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : value => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : error => {
            throw error;
          };
    const promise2 = new Promise((resolve, reject) => {
      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(value => {
          try {
            const x = onFulfilled(value);
            // 需要在 resolvePromise 中判断 promise2 和 x 是否是同一个
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
        this.onRejectedCallbacks.push(reason => {
          try {
            const x = onRejected(reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }

      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
    });

    return promise2;
  }
}

module.exports = Promise;
```

### 实现 Promise/A+ 规范
```javascript
"use strict";

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

const resolvePromise = (promise2, x, resolve, reject) => {
  if (promise2 === x) {
    return reject(
      new TypeError("TypeError: Chaining cycle detected for promise #<Promise>")
    );
  }

  // 最多只能调用一次
  let called;
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    try {
      const then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          r => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        return resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      return reject(error);
    }
  } else {
    return resolve(x);
  }
};

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {
      // 判断传入的 value 是否是 Promise 对象
      if (value instanceof Promise) {
        return value.then(resolve, reject);
      }
      setTimeout(() => {
        if (this.status === PENDING) {
          this.status = FULFILLED;
          this.value = value;
          this.onFulfilledCallbacks.forEach(fn => fn(this.value));
        }
      }, 0);
    };

    const reject = reason => {
      setTimeout(() => {
        if (this.status === PENDING) {
          this.status = REJECTED;
          this.reason = reason;
          this.onRejectedCallbacks.forEach(fn => fn(this.reason));
        }
      }, 0);
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : value => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : error => {
            throw error;
          };
    const promise2 = new Promise((resolve, reject) => {
      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(value => {
          try {
            const x = onFulfilled(value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
        this.onRejectedCallbacks.push(reason => {
          try {
            const x = onRejected(reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }

      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
    });

    return promise2;
  }
}

Promise.deferred = () => {
  const defered = {};
  defered.promise = new Promise((resolve, reject) => {
    defered.resolve = resolve;
    defered.reject = reject;
  });
  return defered;
};

module.exports = Promise;

```

## 总结

虽然 Promise 可以让开发者远离金字塔代码，但是其链式写法并不算是完全的同步写法，异步的终极解决方案应该是 async/await。
