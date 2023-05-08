const fsPromises = require('fs').promises
const path = require('path')

assembleCSS(path.join(__dirname, 'styles'), path.join(__dirname, 'project-dist'), 'bundle.css')

async function assembleCSS(src, dest, fname) {
  try {
    const files = await fsPromises.readdir(src, { withFileTypes : true })
    await fsPromises.mkdir(dest, { recursive: true });

    let data = ''
    for (const file of files) {
      if (!file.isFile() || path.parse(file.name).ext !== '.css') continue
      data += await fsPromises.readFile(path.join(src, file.name), 'utf-8')
    }

    fsPromises.writeFile(path.join(dest, fname), data)
  }
  catch (e) {
    console.error(e.message)
    process.exit(1)
  }
}

