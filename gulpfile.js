var gulp = require('gulp');
var jade = require('jade');
var gulpJade = require('gulp-jade');
var RevAll = require('gulp-rev-all');
var stylus = require('gulp-stylus');
var timestampFile = require('./lib/gulp-timestamp');
var cloudFront = require('./lib/gulp-cloudfront');
var activeNav = require('./lib/gulp-active-nav');
var livereload = require('gulp-livereload');
var blog = require('./lib/blog');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var artistData = require('./src/data/artists');
var releases = require('./src/data/releases');
var templateHelpers = require('./lib/template-helpers');

var revAll = new RevAll({
  dontRenameFile: [/\.html$/g],
  dontUpdateReference: [/\.html$/g]
});


gulp.task('jade', function () {
  return gulp.src(['./src/**/*.jade', '!./src/{,jade/**}', '!./src/{,blog/**}'])
    .pipe(gulpJade({
      compileDebug: true,
      pretty: true,
      data: {
        artistData: artistData,
        releases: releases,
        helpers: templateHelpers
      }
    }))
    .pipe(activeNav())
    .pipe(gulp.dest('tmp/'))
    .pipe(livereload())
})

gulp.task('img', function() {
  return gulp.src(['./src/imgs/**'])
  .pipe(gulp.dest('tmp/imgs'))
});

gulp.task('fonts', function() {
  return gulp.src(['./src/fonts/**'])
  .pipe(gulp.dest('tmp/fonts'))
});

gulp.task('rev', function() {
  return gulp.src(['./tmp/**/'])
      .pipe(revAll.revision())
      .pipe(timestampFile())
      .pipe(cloudFront())
      .pipe(gulp.dest('./build'))
});

gulp.task('css', function() {
  return gulp.src(['./src/stylus/styles.styl'])
      .pipe(stylus())
      .pipe(gulp.dest('./tmp/css'))
      .pipe(livereload());
});

gulp.task('js', function() {
  return browserify({
          entries: ['./src/js/test.js']
      })
      .bundle()
      .pipe(source('app.js'))
      .pipe(gulp.dest('./tmp/js'))
      .pipe(livereload());
});

gulp.task('blog', function() {
  return gulp.src(['./src/blog/**/*.jade'])
        .pipe(blog({pretty: true}))
        .pipe(timestampFile())
        .pipe(gulp.dest('tmp/blog'))
});


gulp.task('default', ['jade', 'img', 'fonts', 'css', 'js', 'watch'])
gulp.task('prod', ['rev'])
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('./src/stylus/*.styl', ['css']);
  gulp.watch(['./src/**/*.jade', './src/data/*.js'], ['jade']);
  gulp.watch('./src/js/*.js', ['js']);
});
