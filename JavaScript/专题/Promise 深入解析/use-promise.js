const Promise = require("./promise");

// 1. 同步基本使用
// const p = new Promise((resolve, reject) => {
//   console.log("去做承诺的事情");
//   const luckyNumber = Math.random();
//   if (luckyNumber > 0.5) {
//     resolve("做好了");
//   }
//   reject("做不好了");
// });

// p.then(
//   value => {
//     console.log("TA 做到了，因为", value);
//   },
//   reason => {
//     console.log("TA 没做到，因为", reason);
//   }
// );

// 2. 异步基本使用
// const p = new Promise((resolve, reject) => {
//   console.log("去做承诺的事情");
//   // 使用 setTimeout 表示执行异步操作
//   setTimeout(() => {
//     const luckyNumber = Math.random();
//     if (luckyNumber > 0.5) {
//       resolve("做好了");
//     }
//     reject("做不好了");
//   }, 1000);
// });

// p.then(
//   value => {
//     console.log("Success", value);
//   },
//   reason => {
//     console.log("Fail", reason);
//   }
// );

// // 3. 同步错误捕获，如果先 resolve\reject，错误不会捕获
// const p = new Promise((resolve, reject) => {
//   console.log("去做承诺的事情");
//   // resolve('做好了')
//   // reject('做不好了')
//   throw new Error("发生意外情况。");
// });

// p.then(
//   value => {
//     console.log("Success", value);
//   },
//   reason => {
//     console.log("Fail", reason);
//   }
// );

// // 4. 异步错误无法捕获
// const p = new Promise((resolve, reject) => {
//   console.log("去做承诺的事情");
//   setTimeout(() => {
//     throw new Error("发生意外情况。");
//     resolve("做好了");
//   }, 1000);
// });

// p.then(
//   value => {
//     console.log("Success", value);
//   },
//   reason => {
//     console.log("Fail", reason);
//   }
// );

// // 5. 链式调用，then 返回基本类型值
// const p = new Promise((resolve, reject) => {
//   console.log("去做承诺的事情");
//   const luckyNumber = Math.random();
//   if (luckyNumber > 0.5) {
//     resolve("做好了");
//   }
//   reject("做不好了");
// })
//   .then(
//     value => {
//       console.log("Success", value);
//       return "高兴";
//     },
//     reason => {
//       console.log("Fail", reason);
//       return "难受";
//     }
//   )
//   .then(
//     value => {
//       console.log("返回值 value", value);
//     },
//     reason => {
//       console.log("返回值 reason", reason);
//     }
//   );

// // 6. 链式调用，then 抛出异常
// const p = new Promise((resolve, reject) => {
//   console.log("去做承诺的事情");
//   const luckyNumber = Math.random();
//   if (luckyNumber > 0.5) {
//     resolve("做好了");
//   }
//   reject("做不好了");
// })
//   .then(
//     value => {
//       console.log("Success", value);
//       return "高兴";
//     },
//     reason => {
//       console.log("Fail", reason);
//       // return new Error('难受')
//       throw new Error("难受");
//     }
//   )
//   .then(
//     value => {
//       console.log("返回值 value", value);
//     },
//     reason => {
//       console.log("返回值 reason", reason);
//     }
//   );

// // 7. 链式调用，then 返回 Promise.resolve\Promise.reject
// const p = new Promise((resolve, reject) => {
//   console.log("去做承诺的事情");
//   const luckyNumber = Math.random();
//   if (luckyNumber > 0.5) {
//     resolve("做好了");
//   }
//   reject("做不好了");
// })
//   .then(
//     value => {
//       console.log("Success", value);
//       return new Promise(resolve => resolve("高兴"));
//     },
//     reason => {
//       console.log("Fail", reason);
//       return new Promise((resolve, reject) => reject("难受"));
//     }
//   )
//   .then(
//     value => {
//       console.log("返回值 value", value);
//     },
//     reason => {
//       console.log("返回值 reason", reason);
//     }
//   );

// // 8. 链式调用，then 值的穿透
// const p = new Promise((resolve, reject) => {
//   console.log("去做承诺的事情");
//   const luckyNumber = Math.random();
//   if (luckyNumber > 0.5) {
//     resolve("做好了");
//   }
//   reject("做不好了");
// })
//   .then()
//   .then()
//   .then(
//     value => {
//       console.log("Success", value);
//       return new Promise(resolve => resolve("高兴"));
//     },
//     reason => {
//       console.log("Fail", reason);
//       return new Promise((resolve, reject) => reject("难受"));
//     }
//   )
//   .then(
//     value => {
//       console.log("返回值 value", value);
//     },
//     reason => {
//       console.log("返回值 reason", reason);
//     }
//   );

// // 9. 链式调用，then 返回一个异步 Promise
// const p = new Promise((resolve, reject) => {
//   console.log("去做承诺的事情");
//   const luckyNumber = Math.random();
//   if (luckyNumber > 0.5) {
//     resolve("做好了");
//   }
//   reject("做不好了");
// })
//   .then(
//     value => {
//       console.log("Success", value);
//       return new Promise((resolve, reject) => {
//         setTimeout(() => {
//           resolve("高兴");
//         }, 1000);
//       });
//     },
//     reason => {
//       console.log("Fail", reason);
//       return new Promise((resolve, reject) => {
//         setTimeout(() => {
//           reject("难受");
//         }, 1000);
//       });
//     }
//   )
//   .then(
//     value => {
//       console.log("返回值 value", value);
//     },
//     reason => {
//       console.log("返回值 reason", reason);
//     }
//   );

// // 10. 链式调用，resolve 传入 Promise, 执行器中的 resolve 传入 Promise
// const p = new Promise((resolve1, reject1) => {
//   console.log("去做承诺的事情");
//   const luckyNumber = Math.random();
//   if (luckyNumber > 0.5) {
//     resolve1(
//       new Promise((resolve2, reject2) => {
//         resolve2("做好了");
//       })
//     );
//   }
//   resolve1(
//     new Promise((resolve2, reject2) => {
//       reject2("做不好了");
//     })
//   );
// })
//   .then(
//     value => {
//       console.log("Success", value);
//       return new Promise((resolve1, reject1) => {
//         resolve1(
//           new Promise((resolve2, reject2) => {
//             setTimeout(() => {
//               resolve2("高兴");
//             }, 1000);
//           })
//         );
//       });
//     },
//     reason => {
//       console.log("Fail", reason);
//       return new Promise((resolve1, reject1) => {
//         resolve1(
//           new Promise((resolve2, reject2) => {
//             setTimeout(() => {
//               reject2("难受");
//             }, 1000);
//           })
//         );
//       });
//     }
//   )
//   .then(
//     value => {
//       console.log("返回值 value", value);
//     },
//     reason => {
//       console.log("返回值 reason", reason);
//     }
//   );

// // 11. 链式调用，resolve 多层嵌套 Promise，状态由最内层状态决定
// const p = new Promise((resolve, reject) => {
//   console.log("去做承诺的事情");
//   const luckyNumber = Math.random();
//   if (luckyNumber > 0.5) {
//     resolve("做好了");
//   }
//   reject("做不好了");
// })
//   .then(
//     value => {
//       console.log("Success", value);
//       return new Promise((resolve1, reject1) => {
//         resolve1(
//           new Promise((resolve2, reject2) => {
//             resolve2(
//               new Promise((resolve3, reject3) => {
//                 resolve3(
//                   new Promise((resolve4, reject4) => {
//                     setTimeout(() => {
//                       resolve4("高兴");
//                     }, 1000);
//                   })
//                 );
//               })
//             );
//           })
//         );
//       });
//     },
//     reason => {
//       console.log("Fail", reason);
//       return new Promise((resolve1, reject1) => {
//         resolve1(
//           new Promise((resolve2, reject2) => {
//             resolve2(
//               new Promise((resolve3, reject3) => {
//                 resolve3(
//                   new Promise((resolve4, reject4) => {
//                     setTimeout(() => {
//                       reject4("难受");
//                     }, 1000);
//                   })
//                 );
//               })
//             );
//           })
//         );
//       });
//     }
//   )
//   .then(
//     value => {
//       console.log("返回值 value", value);
//     },
//     reason => {
//       console.log("返回值 reason", reason);
//     }
//   );

// // 12. 链式调用，同一个 Promise 对象多次调用 then 方法
// const p = new Promise((resolve, reject) => {
//   console.log("去做承诺的事情");
//   const luckyNumber = Math.random();
//   if (luckyNumber > 0.5) {
//     resolve("做好了");
//   }
//   reject("做不好了");
// });

// p.then(
//   value => {
//     console.log("返回值 value", value);
//   },
//   reason => {
//     console.log("返回值 reason", reason);
//   }
// );

// p.then(
//   value => {
//     console.log("返回值 value", value);
//   },
//   reason => {
//     console.log("返回值 reason", reason);
//   }
// );

// // 13. 链式调用，p 对象是 then 方法返回的 Promise 对象
// const p = new Promise((resolve, reject) => {
//   console.log("去做承诺的事情");
//   const luckyNumber = Math.random();
//   if (luckyNumber > 0.5) {
//     resolve("做好了");
//   }
//   reject("做不好了");
// }).then(
//   value => {
//     console.log("返回值 value", value);
//   },
//   reason => {
//     console.log("返回值 reason", reason);
//   }
// );

// p.then(
//   value => {
//     console.log("out 返回值 value", value);
//   },
//   reason => {
//     console.log("out 返回值 reason", reason);
//   }
// );

// // 14. 链式调用中的循环引用
// const p = Promise.resolve("做好了").then(value => p);

// let p1 = new Promise((resolve, reject) => {
//   resolve(1000);
// });
// let p2 = p1.then(() => p2);
// p2.then(null, err => console.log(err));

// // 15. Promise 对象变成失败态之后如果不调用 then 的失败方法或者 catch 方法，会抛出一个错误，但是不会终止程序
// new Promise((resolve, reject) => {
//   reject("做不到");
// });
// .then(null, err => console.log("err", err)); // 未捕获的reject错误
// setTimeout(() => {
//   console.log("难受");
// }, 1000);

// 16. then 穿透
new Promise((resolve, reject) => {
  console.log(11);
  resolve(1000);
}).then(console.log(222));
