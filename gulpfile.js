var gulp = require('gulp'),
    replace = require('gulp-replace'),
    htmlMin = require('gulp-minify-html'),
    minCSS = require('gulp-minify-css'),
    replace =require('gulp-replace'),
    flatten = require('gulp-flatten'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    express = require('express'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    express = require('express');

var paths = {
    css: './_site/css/*.css',
    js: './_site/js/*.js',
    site: './_site',
    html: './_site/**/*.html',
    imgs: './_site/imgs/*.{jpg,png,gif}'
}

var server = express(),
    reload = lr();

gulp.task('default', ['html', 'css', 'js', 'imgs'],function () {

});

gulp.task('html', function() {
    gulp.src(paths.html)
        .pipe(replace('/js/jquery-1.4.2.min.js', '//ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js'))
        .pipe(replace('/js/moment.min.js', '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.6.0/moment.min.js'))
        .pipe(replace(/<script.*?src="\/js\/.*?<\/script>/g,''))
        .pipe(replace(/<\/body>/, '<script type="text/javascript" src="/js/production.min.js"></body>'))
        .pipe(htmlMin())
        .pipe(gulp.dest('./dist'))
})

gulp.task('css', function() {
    gulp.src(paths.css)
        .pipe(minCSS())
        .pipe(gulp.dest('./dist/css'))
})

gulp.task('js', function() {
    return gulp.src('./_site/js/site.js')
      .pipe(uglify())
      .pipe(gulp.dest('./dist/js'))
      .pipe(gulp.src('./_site/js/slideshow.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./dist/js'))
      .pipe(gulp.src('./_site/js/shows.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./dist/js'))
      .pipe(gulp.src(['./_site/js/site.js',
                     './_site/js/shows.js',
                     './_site/js/slideshow.js']))
      .pipe(uglify())
      .pipe(concat('production.min.js'))
      .pipe(gulp.dest('./dist/js'))
})

gulp.task('imgs', function() {
    return gulp.src(paths.imgs)
               .pipe(gulp.dest('./dist/imgs'))
})

gulp.task('watch', function() {
    gulp.watch([paths.css, paths.imgs, paths.js], function() {
       // gulp.start('html');
    });
});

gulp.task('server', function() {
    server.use(express.static('./dist'));
    server.listen(8000);
    reload.listen(35729);

    gulp.start('watch');
});

gulp.task('clean', function() {
    return gulp.src('dist/*', { read: false })
        .pipe(clean());
});