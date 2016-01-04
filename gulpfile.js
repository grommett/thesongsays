var gulp = require('gulp');
var jade = require('jade');
var gulpJade = require('gulp-jade');
var RevAll = require('gulp-rev-all');
var stylus = require('gulp-stylus');
var timestampFile = require('./plugins/gulp-timestamp');
var livereload = require('gulp-livereload');
var blog = require('./plugins/blog');

var revAll = new RevAll({
  dontRenameFile: [/\.html$/g],
  dontUpdateReference: [/\.html$/g]
});

gulp.task('jade', function () {
  return gulp.src(['./src/**/*.jade', '!./src/{,includes/**}', '!./src/{,layouts/**}', '!./src/{,blog/**}'])
    .pipe(gulpJade({
      compileDebug: true,
      pretty: true
    }))
    .pipe(timestampFile())
    .pipe(gulp.dest('tmp/'))
    .pipe(livereload())
    .on('end', function() {
      console.log('DONE!')
    });
})

gulp.task('img', function() {
  return gulp.src(['./src/imgs/**'])
  .pipe(gulp.dest('tmp/imgs'))
});

gulp.task('rev', function() {
  return gulp.src(['./tmp/**/'])
      .pipe(revAll.revision())
      .pipe(timestampFile())
      .pipe(gulp.dest('./build'))
});

gulp.task('css', function() {
  return gulp.src(['./src/stylus/styles.styl'])
      .pipe(stylus())
      .pipe(gulp.dest('./tmp/css'))
      .pipe(livereload());
});

gulp.task('blog', function() {
  return gulp.src(['./src/blog/**/*.jade'])
        .pipe(blog({pretty: true}))
        .pipe(gulp.dest('tmp/blog'))

});


gulp.task('default', ['jade', 'img', 'css', 'watch'])

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('./src/stylus/*.styl', ['css']);
  gulp.watch('./src/**/*.jade', ['jade']);
});
