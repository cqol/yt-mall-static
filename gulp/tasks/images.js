var gulp       = require('gulp');
var imagemin   = require('gulp-imagemin');
var config     = require('../config').images;
var distConfig = require('../config').production;

gulp.task('images', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});

gulp.task('minifyImages', ['images'], function() {
  return gulp.src(distConfig.imgSrc)
    .pipe(imagemin()) // Optimize
    .pipe(gulp.dest(distConfig.imgDest));
});