var gulp         = require('gulp');
var handleErrors = require('../util/handleErrors');
var fonts       = require('../config').fonts;
var distConfig = require('../config').production;


gulp.task('fonts', function () {
	return gulp.src(fonts.src)
		.on('error', handleErrors)
		.pipe(gulp.dest(fonts.dest));
});


gulp.task('distfonts', ['fonts'], function () {
	return gulp.src(distConfig.fontSrc)
		.on('error', handleErrors)
		.pipe(gulp.dest(distConfig.fontDest));
});