const fs = require('fs');
const path = require('path')

const filePath = path.resolve(__dirname, './test.txt');

// 经测试，会覆盖文件原内容
fs.writeFileSync(filePath, '覆盖测试');
