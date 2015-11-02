var gulp      = require('gulp');
var config    = require('../config').production;
var minifyCSS = require('gulp-minify-css');
var size      = require('gulp-filesize');
var replace = require('gulp-replace');

gulp.task('minifyCss', ['styles'], function() {
  return gulp.src(config.cssSrc)
    // replace cdn
    //.pipe(replace(/url\(([^)]+)\)/ig, 'url(' + config.cdn + '$1)'))
    .pipe(minifyCSS())
    .pipe(gulp.dest(config.cssDest))
    .pipe(size());
});

gulp.task('sCss', ['styles'], function() {
  return gulp.src(config.cssSrc)
    // replace cdn
    //.pipe(replace(/url\(([^)]+)\)/ig, 'url(' + config.cdn + '$1)'))
    .pipe(gulp.dest(config.cssDest))
    .pipe(size());
});
