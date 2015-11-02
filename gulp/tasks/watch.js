/* Notes:
 - gulp/tasks/browserify.js handles js recompiling with watchify
 - gulp/tasks/connect.js watches and reloads compiled files
 */

var gulp = require('gulp');
var config = require('../config').watch;
var livereload = require('gulp-livereload');

gulp.task('watch', ['watchify', 'connect'], function () {
	livereload.listen();

	gulp.watch(config.styles, ['styles']);
	gulp.watch(config.images, ['images']);
	gulp.watch(config.htmls, ['velocity']);
	gulp.watch(config.sprites, ['sprites']);
	// Watchify will watch and recompile our JS, so no need to gulp.watch it

	// watch for changes
	gulp.watch(config.files).on('change', livereload.changed);

});
