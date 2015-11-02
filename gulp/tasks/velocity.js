var gulp = require('gulp'),
	rename = require('gulp-rename'),
	vm = require('gulp-velocityjs');
var config = require('../config').velocity;

//var config = {
//	// tpl root
//	'root': './app/tpl',
//	'encoding': 'utf-8',
//	//global macro defined file
//	'macro': 'src/vm/tpl/global-macro/macro.vm',
//	'globalMacroPath': 'src/vm/tpl/global-macro',
//	// test data root path
//	'dataPath': './fixtures'
//};

gulp.task('velocity', function() {
	gulp.src(config.src + '/**/*.vm')
		.pipe(vm(config))
		.pipe(rename({extname:'.html'}))
		.pipe(gulp.dest(config.htmlDir));
})