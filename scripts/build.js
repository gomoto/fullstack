const build = require('./tasks/build')
const config = require('./config/build')
build(config)
.then(() => {
  console.log('Build is done')
})
.catch((error) => {
  console.error(error, error.stack)
  process.exit(1)
})
