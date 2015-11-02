var gulp = require('gulp');

gulp.task('serve', ['connect', 'watch', 'mock'], function () {
  require('opn')('http://localhost:9000');
});
