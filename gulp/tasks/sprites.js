var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var spritesmith = require('gulp.spritesmith');
var globby = require('globby');
var config   = require('../config').sprites;

// Usage in SCSS
// @import "./generated/folder_name";
// @include folder_name-sprite(pic_name);
gulp.task('sprites', function () {
  globby([config.src + '**/*', '!' + config.src + '**/*.*'], function (err, files) {
    files.forEach(function(item) {
      var dir = item.split(config.src)[1];
      var spriteData = gulp.src(config.src + dir + '/*.png').pipe(spritesmith({
        imgName: dir + '.png',
        cssName: '_' + dir + '.scss',
        padding: 4,
        algorithm: 'top-down',
        cssOpts: {
          imgUrlRoot: config.imgUrlRoot,
          folder: dir
        },
        cssTemplate: 'sprite.template.handlebars'
      }));

      spriteData.css
        .pipe(gulp.dest(config.stylesDest));

      spriteData.img
        .pipe(gulp.dest(config.imagesDest));
    });
  });
});
