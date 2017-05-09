const build = require('./tasks/build')
const watch = require('./tasks/watch')
const buildConfig = require('./config/dev.build')
const watchConfig = require('./config/dev.watch')

build(buildConfig).then(() => {
  return watch(watchConfig)
})
.catch((error) => {
  console.error(error, error.stack)
  process.exit(1)
})
