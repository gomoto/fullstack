const addSrc = require('gulp-add-src');
const gulp = require('gulp');
const typescript = require('gulp-typescript');

const appPath = 'app';
const clientPath = 'client';
const serverPath = 'server';
const paths = {
  server: {
    typescript: `${serverPath}/src/**/!(*.spec).ts`,
    typings: `${serverPath}/typings/**/*.d.ts`,
    html: `${serverPath}/src/**/*.html`
  }
};

const serverTypescript = typescript.createProject(`${serverPath}/tsconfig.json`);

gulp.task('build:server', () => {
  return gulp.src([
    paths.server.typescript,
    paths.server.typings
  ])
  .pipe(serverTypescript())
  .pipe(addSrc(paths.server.html))
  .pipe(gulp.dest(`${appPath}/${serverPath}`));
});
