const build = require('./tasks/build')
const watch = require('./tasks/watch')
const buildConfig = require('./config/dev.build')
const watchConfig = require('./config/dev.watch')

build(buildConfig).then(() => {
  watch(watchConfig).then(() => {
    console.log('Watching files')
  })
})
.catch((error) => {
  console.error(error, error.stack)
  process.exit(1)
})
