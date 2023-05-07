const fs = require('fs')
const path = require('path')
const readline = require('node:readline');

printFile(path.join(__dirname, 'text.txt'))

async function printFile(src) {
  const stream = fs.createReadStream(src, 'utf-8')
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity })
  try {
    for await (const line of rl)
      console.log(line)
  }
  catch (e) {
    console.error(e.message)
    process.exit(1)
  }
}
