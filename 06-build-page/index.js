const fsPromises = require('fs').promises
const path = require('path')

const dest = path.join(__dirname, 'project-dist')

process.on('SIGINT', () => process.exit(1));
process.on('exit', code => { if (code === 0) console.log('Done!'); else console.log(`Error: ${code}`) })
main()


async function main() {
  await createFolder(dest)
  assembleHTML()
  assembleCSS()
  copyDir(path.join(__dirname, 'assets'), path.join(dest, 'assets'))
}


async function createFolder(dest) {
  await fsPromises.rm(dest, { recursive: true, force: true })
  await fsPromises.mkdir(dest)
}


async function assembleHTML() {
  try {
    let html = await fsPromises.readFile(path.join(__dirname, 'template.html'), 'utf-8')
    const tags = new Set(html.match(/{{([^{}]+)}}/g))
    const src = path.join(__dirname, 'components')

    for (const tag of tags) {
      const fname = path.join(src, tag.slice(2, -2) + '.html')
      try {
        const content = await fsPromises.readFile(fname, 'utf-8')
        html = html.replaceAll(tag, content)
      }
      catch {
        console.error(`Can't open ${fname}`)
      }
    }

    fsPromises.writeFile(path.join(dest, 'index.html'), html, 'utf-8')
  }
  catch (e) {
    console.error(e.message)
    process.exit(1)
  }
}


async function assembleCSS() {
  try {
    const src = path.join(__dirname, 'styles')
    const files = await fsPromises.readdir(src, { withFileTypes : true })

    let data = ''
    for (const file of files) {
      if (!file.isFile() || path.parse(file.name).ext !== '.css') continue
      data += await fsPromises.readFile(path.join(src, file.name), 'utf-8')
    }

    fsPromises.writeFile(path.join(dest, 'style.css'), data)
  }
  catch (e) {
    console.error(e.message)
    process.exit(1)
  }
}

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
