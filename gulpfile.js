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
var press = require('./src/data/press');
var templateHelpers = require('./lib/template-helpers');
var sitemap = require('gulp-sitemap');

var revAll = new RevAll({
  dontRenameFile: [/\.html$/g, 'tss-social.jpg'],
  dontUpdateReference: [/\.html$/g]
});

gulp.task('sitemap', function() {
  gulp.src('./build/**/*.html')
  .pipe(sitemap({
    siteUrl: 'http://thesongsays.com'
  }))
  .pipe(gulp.dest('./build'));
})

gulp.task('jade', function () {
  var artistData = require('./src/data/artists');
  var releases = require('./src/data/releases');
  return gulp.src(['./src/**/*.jade', '!./src/{,jade/**}', '!./src/{,blog/**}'])
    .pipe(gulpJade({
      compileDebug: true,
      pretty: true,
      data: {
        artistData: artistData,
        releases: releases,
        press: press,
        helpers: templateHelpers
      }
    }))
    .pipe(activeNav())
    .pipe(gulp.dest('tmp/'))
    .pipe(livereload())
})

gulp.task('img', function() {
  return gulp.src(['./src/imgs/**/**'])
  .pipe(gulp.dest('tmp/imgs'))
});


gulp.task('rev:dev', function() {
  return revFiles('dev')
});

gulp.task('rev:prd', function() {
  return revFiles('prd')
});

function revFiles(env) {
  if(!env) env = 'dev';
  return gulp.src(['./tmp/**/**'])
      .pipe(revAll.revision())
      .pipe(timestampFile())
      .pipe(cloudFront({env:env}))
      .pipe(gulp.dest('./build'))
}

gulp.task('css', function() {
  return gulp.src(['./src/stylus/styles.styl'])
      .pipe(stylus({compress: true}))
      .pipe(gulp.dest('./tmp/css'))
      .pipe(livereload());
});

gulp.task('blog', function() {
  return gulp.src(['./src/blog/**/*.jade'])
        .pipe(blog({pretty: true}))
        .pipe(timestampFile())
        .pipe(gulp.dest('tmp/blog'))
});

gulp.task('site-js', function() {
  return browserify({
    entries: ['./src/js/site.js']
  })
  .bundle()
  .pipe(source('site.js'))
  .pipe(gulp.dest('./tmp/js'))
  .pipe(livereload());
});

gulp.task('artist-js', function() {
  return browserify({
    entries: ['./src/js/site.js', './src/js/read-more.js']
  })
  .bundle()
  .pipe(source('artist.js'))
  .pipe(gulp.dest('./tmp/js'))
  .pipe(livereload());
});

gulp.task('release-js', function() {
  return browserify({
    entries: ['./src/js/site.js', './src/js/tracks.js', './src/js/read-more.js']
  })
  .bundle()
  .pipe(source('release.js'))
  .pipe(gulp.dest('./tmp/js'))
  .pipe(livereload());
});

gulp.task('home-js', function() {
  return browserify({
    entries: ['./src/js/site.js', './src/js/vimeo-player.js']
  })
  .bundle()
  .pipe(source('home.js'))
  .pipe(gulp.dest('./tmp/js'))
  .pipe(livereload());
});

gulp.task('default', ['jade', 'img', 'css', 'watch', 'site-js', 'home-js', 'artist-js', 'release-js']);

gulp.task('prod', ['rev']);

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('./src/stylus/*.styl', ['css']);
  gulp.watch(['./src/data/*.js'], ['jade']);
  gulp.watch(['./src/**/*.jade'], ['jade']);
  gulp.watch(['./src/js/*.js'], ['site-js', 'artist-js', 'release-js', 'home-js']);
});
