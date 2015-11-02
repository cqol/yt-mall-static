var gulp = require('gulp');
var config = require('../config').production;
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var del = require('del');
var replace = require('gulp-replace');
var gulpFilter = require('gulp-filter');

gulp.task('markup', function() {
	var assets = useref.assets();
	var htmlFilter = gulpFilter(['**/*.vm']);

	var today = gutil.date('yyyymmddHHMM');

	return gulp.src(config.htmlSrc)
		.pipe(assets)
		.pipe(gulpif('*.js', uglify()))
		.pipe(assets.restore())
		.pipe(useref())
		.pipe(htmlFilter)
		// replace cdn
		.pipe(replace(/(<script.+|<img.+|<source.+)(?:src)=['"](?!\w+?:?\/\/)([^'"\{]+)['"]/ig, function(p, m1, m2) {
			return m1 + 'src="' + config.cdn + m2 + '?t=' + today +
				'"';
		}))
		.pipe(replace(/(<link.+)(?:href)=['"](?!\w+?:?\/\/)([^'"\{]+)['"]/ig, function(p, m1, m2) {
			return m1 + 'href="' + config.cdn + m2 + '?t=' + today +
				'"';
		}))
		.pipe(htmlFilter.restore())
		.pipe(gulp.dest(config.htmlDest));
});

// Copy auto generated refs(scripts, styles) to static folder
gulp.task('copyRefScripts', ['markup'], function() {
	return gulp.src(config.refScripts, {base: config.htmlDest})
		.pipe(gulp.dest(config.staticDest));
});

// Remove auto generaged refs
gulp.task('htmls', ['copyRefScripts'], del.bind(null, [config.refScriptsDir]));
