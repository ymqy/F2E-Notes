const p1 = new Promise((resolve, reject) => {
  resolve(1);
});

const p2 = new Promise((resolve, reject) => {
  reject(2);
});

const p = Promise.all([p1, p2]).then((result) => {
  console.log('TCL: result', result);
}).catch((err) => {
  console.log('TCL: err', err);
});
