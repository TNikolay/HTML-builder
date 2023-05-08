const fsPromises = require('fs').promises
const path = require('path')

copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'))

async function copyDir(src, dest, noRm = false) {
  try {
    const files = (await fsPromises.readdir(src, { withFileTypes : true }))

    if (!noRm) await fsPromises.rm(dest, { recursive: true, force: true })
    await fsPromises.mkdir(dest)

    for (const file of files) {
      if (file.isFile())
        fsPromises.copyFile(path.join(src, file.name), path.join(dest, file.name))
      else
        copyDir(path.join(src, file.name), path.join(dest, file.name), true)
    }
  }
  catch (e) {
    console.error(e.message)
    process.exit(1)
  }
}

