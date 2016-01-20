var gulp = require('gulp');
var jade = require('jade');
var gulpJade = require('gulp-jade');
var RevAll = require('gulp-rev-all');
var stylus = require('gulp-stylus');
var timestampFile = require('./plugins/gulp-timestamp');
var livereload = require('gulp-livereload');
var blog = require('./plugins/blog');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var artistData = require('./src/data/artists');
var releases = require('./src/data/releases');

var revAll = new RevAll({
  dontRenameFile: [/\.html$/g],
  dontUpdateReference: [/\.html$/g]
});

function getReleasesByArtist(artist, releases) {
  var found = releases.filter(function(release) {
    return release.artist == artist
  }).sort(function(a,b) {
    return a.date < b.date
  })
  return found;
}

function sortByDate(arr) {
  var found = arr.sort(function(a,b) {
    if(a.date < b.date) return 1
    if(a.date > b.date) return -1
    return 0;
  })
  return found;
}

function sortByProp(arr, prop) {
  var found = arr.sort(function(a,b) {
    if(a[prop] < b[prop]) return 1
    if(a[prop] > b[prop]) return -1
    return 0;
  })
  return found;
}

function getArtists(artists) {
  var found = artists.sort(function(a,b) {
    if(a.name > b.name) return 1
    if(a.name < b.name) return -1
    return 0
  })
  return found;
}

function getTracks(artistRelease, releases) {
  var found = releases.filter(function(release) {
    return release.title === artistRelease
  })
  return found[0].tracks;
}

gulp.task('jade', function () {
  return gulp.src(['./src/**/*.jade', '!./src/{,jade/**}', '!./src/{,blog/**}'])
    .pipe(gulpJade({
      compileDebug: true,
      pretty: true,
      data: {
        artistData: artistData,
        releases: releases,
        helpers: {
          getReleasesByArtist: getReleasesByArtist,
          sortByDate: sortByDate,
          sortByProp: sortByProp,
          getTracks: getTracks
        }
      }
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

gulp.task('fonts', function() {
  return gulp.src(['./src/fonts/**'])
  .pipe(gulp.dest('tmp/fonts'))
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

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('./src/stylus/*.styl', ['css']);
  gulp.watch('./src/**/*.jade', ['jade']);
  gulp.watch('./src/js/*.js', ['js']);
});
