const build = require('./tasks/build')
const config = require('./config/build')
build(config)
.then(() => {
  console.log('Build is done')
})
