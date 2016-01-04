var gulp = require('gulp'),
    replace = require('gulp-replace'),
    htmlMin = require('gulp-minify-html'),
    minCSS = require('gulp-minify-css'),
    replace =require('gulp-replace'),
    flatten = require('gulp-flatten'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    gulpif = require('gulp-if'),
    express = require('express'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    express = require('express')
    dir = './dist',
    baseUrl = '/thesongsays';

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
    livereload(reload);
});

gulp.task('html', function() {
    gulp.src(paths.html)
        .pipe(replace('/thesongsays/js/jquery-1.4.2.min.js', '//ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js'))
        .pipe(replace('/thesongsays/js/moment.min.js', '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.6.0/moment.min.js'))
        .pipe(replace('/thesongsays/js/handlebars.min.js', '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars.min.js'))
        .pipe(replace('/thesongsays', baseUrl))
        //.pipe(replace(/<script.*?src="\/thesongsays\/js\/.*?<\/script>/g,''))
        .pipe(replace(/<\/body>/, '<script type="text/javascript" src="'+baseUrl+'/js/production.min.js"></body>'))
        .pipe(gulpif(baseUrl==='', replace(/<\/body\>/, "<script src='http://localhost:35729/livereload.js'></script></body>")))
        .pipe(htmlMin())
        .pipe(gulp.dest(dir))
})

gulp.task('css', function() {
    gulp.src(paths.css)
        .pipe(replace('/thesongsays', baseUrl))
        .pipe(minCSS())
        .pipe(gulp.dest(dir+'/css'))
})

gulp.task('js', function() {
    return gulp.src(['./_site/js/site.js',
                     './_site/js/shows.js',
                     './_site/js/slideshow.js'])
      //.pipe(uglify())
      .pipe(concat('production.min.js'))
      .pipe(gulp.dest(dir+'/js'))
})

gulp.task('imgs', function() {
    return gulp.src(paths.imgs)
               .pipe(gulp.dest(dir+'/imgs'))
})

gulp.task('watch', function() {
    return gulp.watch([paths.html, paths.css, paths.imgs, paths.js], function(event) {
      gulp.start('default');
    });
});

gulp.task('preview', function() {
    dir = './preview';
    baseUrl = '';
    gulp.start('default');
    gulp.start('server');
})

gulp.task('server', function() {
    server.use(express.static(dir));
    server.listen(8000);
    reload.listen(35729);

    gulp.start('watch');
});

gulp.task('clean', function() {
    return gulp.src('dist/*', { read: false })
        .pipe(clean());
});
