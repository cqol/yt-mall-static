var gulp    = require('gulp');
var config  = require('../config').production;
var size    = require('gulp-filesize');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');

var today = gutil.date(undefined, 'yyyy-mm-dd HH:MM');

gulp.task('uglifyJs', ['browserify'], function() {var today = gutil.date(undefined, 'yyyy-mm-dd HH:MM');

	return gulp.src(config.jsSrc)
		.pipe(uglify({compress: {drop_console: true}, banner: '/* @date:' + today + ' */\n'}))
		.pipe(gulp.dest(config.jsDest))
		.pipe(size());
});

gulp.task('suglifyJs', ['browserify'], function() {var today = gutil.date(undefined, 'yyyy-mm-dd HH:MM');

	return gulp.src(config.jsSrc)
		.pipe(gulp.dest(config.jsDest));
});
