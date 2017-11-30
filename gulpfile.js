'use strict';

//var livereload   = require('gulp-livereload');
const gulp         = require('gulp');
const connect      = require('gulp-connect');
const browserify   = require('browserify');
const vinylSource  = require('vinyl-source-stream');
const uglify       = require('gulp-uglify');
const rename       = require('gulp-rename');
const sass         = require('gulp-sass');
const autoPrefixer = require('gulp-autoprefixer');
const cleanCSS     = require('gulp-clean-css');
const buffer       = require('vinyl-buffer');
const pug          = require('gulp-pug');
const pump         = require('pump');

const babelify     = require('babelify');
const babel        = require('gulp-babel');
const imagemin     = require('gulp-imagemin');

gulp.task('img:dev', function() {
  gulp.src('src/img/*')
    // .pipe(imagemin())
    .pipe(gulp.dest('./dev/img'))
    .pipe(connect.reload());
});

gulp.task('package', function() {
  gulp.src('package.json')
    .pipe(gulp.dest('./dist'));
});

gulp.task('fonts:dev', function() {
  gulp.src('src/fonts/**')
    .pipe(gulp.dest('./dev/fonts/'));
});

gulp.task('fonts:dist', function() {
  gulp.src('src/fonts/**')
    .pipe(gulp.dest('./dist/fonts/'));
});

gulp.task('img:dist', function() {
  gulp.src('src/img/*')
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(gulp.dest('./dist/img'));
});

gulp.task('pug', function () {
  return gulp.src('src/view/index.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./dev/'))
    .pipe(connect.reload());
});

gulp.task('pug:dist', function () {
  return gulp.src('src/view/index.pug')
    .pipe(pug({
      pretty: false
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('js', function() {
  return browserify({
      entries: 'src/js/main.js'
    })
    .transform(babelify, { presets: ['env'] })
    .bundle()
    .on('error', function(err) {
      console.log(err.stack);
      // notifier.notify({
      //   'title': 'Compile Error',
      //   message: err.message
      // })
      this.emit('end');
    })
    .pipe(vinylSource('bundle.js'))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('./dev'))
    .pipe(connect.reload());
});

gulp.task('compressjs', ['js'], function() {
    gulp.src('./dev/bundle.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass', function(){
  return gulp.src('src/style/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoPrefixer({
      browsers: ['last 2 versions', '> 1%', 'IE 8'],
      cascade: false
    }))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('dev'))
    .pipe(connect.reload());
});

gulp.task('css', ['sass'], function(){
  return gulp.src('dev/style.css')
    .pipe( cleanCSS({compatibility: 'ie8'}) )
    .pipe(gulp.dest('dist'));
});

// server for dev
gulp.task('connect-dev', function() {
  connect.server({
    name: 'B2B style lib',
    root: './dev',
    port: 8082,
    livereload: true
  });
});

gulp.task('watch', function(){
  gulp.watch('./src/view/**/*.pug', ['pug']);
  gulp.watch('./src/view/**/*.html', ['pug']);
  gulp.watch('./src/js/**/*.js', ['js']);
  gulp.watch('./src/style/**/*.sass', ['sass']);
  gulp.watch('./src/style/**/*.scss', ['sass']);
  gulp.watch('./src/img/**/*.jpg', ['img']);
  gulp.watch('./src/img/**/*.png', ['img']);
  gulp.watch('./src/fonts/**', ['fonts']);
});

gulp.task('default', ['connect-dev', 'img:dev', 'fonts:dev', 'pug', 'sass', 'js', 'watch']);
gulp.task('dev', ['connect-dev', 'img:dev', 'fonts:dev', 'pug', 'sass', 'js', 'watch']);
gulp.task('build', ['pug:dist', 'css', 'img:dist', 'fonts:dist', 'compressjs', 'package']);
