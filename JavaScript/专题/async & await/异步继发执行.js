const list = [1, 2];

const asyncFn = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data)
    }, 500)
  })
}

async function main() {
  for (const e of list) {
    const data = await asyncFn(e)
    console.log('TCL: main -> data', data);
  }
}

main();
