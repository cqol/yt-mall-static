var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var config = require('../config');

gulp.task('clean', del.bind(null, [config.dir.dist]));
gulp.task('cleanTmp', del.bind(null, [config.dir.tmp]));

gulp.task('build', function(cb) {
  runSequence('clean', ['htmls', 'minifyImages', 'minifyCss', 'uglifyJs', 'distfonts'], 'cleanTmp', cb);
});

gulp.task('build-s', function(cb) {
  runSequence('clean', ['htmls', 'minifyImages', 'sCss', 'suglifyJs', 'distfonts'], 'cleanTmp', cb);
});
