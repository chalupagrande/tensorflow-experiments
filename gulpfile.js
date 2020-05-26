const { src, dest, watch, series } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps')



function javascript() {
  return src(['src/**/*.js', 'src/*.js'])
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(babel())
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(dest('dist'));
}

function serve() {
  browserSync.init({
      server: {
          baseDir: "./"
      }
  });
}

function reload(done) {
  browserSync.reload()
  done()
}

function defaultTask(){
  serve()
  watch(['./*.html', 'src/*.js', 'src/**/*.js'], series(javascript, reload));
}
exports.default = defaultTask