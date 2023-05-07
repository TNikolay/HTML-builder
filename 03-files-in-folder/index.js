const fsPromises = require('fs').promises
const path = require('path')

ls(path.join(__dirname, 'secret-folder'))

async function ls(src) {
  try {
    const files = (await fsPromises.readdir(src, { withFileTypes : true }))

    for (const file of files) {
      if (!file.isFile()) continue
      const stat = await fsPromises.stat(path.join(src, file.name))
      console.log(`${file.name} - ${path.parse(file.name).ext.substring(1)} - ${parseFloat(stat.size / 1024).toFixed(2)}kb`)
    }
  }
  catch (e) {
    console.error(e.message)
    process.exit(1)
  }
}
