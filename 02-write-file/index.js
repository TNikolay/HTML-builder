const fsPromises = require('fs').promises
const path = require('path')
const { stdin } = process

TypeInFile(path.join(__dirname, 'text.txt'))

process.on('SIGINT', () => process.exit(0));

process.on('exit', code => {
    if (code === 0) console.log('\nСпасибо, ваш звонок очень важен для нас\n')
    else console.log(`Ошибка:  Что-то пошло не так. Программа завершилась с кодом ${code}`);
});

async function TypeInFile(src) {
  try {
    const f = await fsPromises.open(src, 'w')
    console.log('Введите сообщение после сигнала (бип-бип)\n')

    for await (const v of stdin) {
      const str = v.toString()
      if (str.trim() === 'exit') process.exit()
      await fsPromises.appendFile(f, str)
    }
  }
  catch(e) {
    console.error(e.message)
    process.exit(1)
  }
}

