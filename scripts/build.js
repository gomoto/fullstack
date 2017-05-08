const config = require('./build.config')
const build = require('./tasks/build')
build(config)
.then(() => {
  console.log('Build is done')
})
