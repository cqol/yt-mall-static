var jshint = require('gulp-jshint');
var gulp   = require('gulp');
var config = require('../config').jshint;

gulp.task('jshint', function() {
	return gulp.src(config.src)
		.pipe(jshint(config.jshintrc))
		.pipe(jshint.reporter('jshint-stylish'));
});