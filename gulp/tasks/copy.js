var gulp = require('gulp');
var shell = require('gulp-shell');
var config = require('../config').copy;

//update *.vm from yt-mall pro
gulp.task('copy', shell.task([
	'echo update *.vm',
	'cd ' + config.javaPro + '&& git pull',

	'cp -r ' + config.javaProDir + '/WEB-INF/aview/setPrice/*' +
	' ./app/htmls/aview/setPrice/',
	'echo update *.vm  branch finished',
]));

gulp.task('update', shell.task([
	'echo copy static',
	'cp -r ./dist/htmls/aview/*' +
	' ' + '../yt-mall/server/src/main/webapp' + '/WEB-INF/aview/',

	'cp -r ./dist/static/*' +
	' ' + '../yt-mall/server/src/main/webapp' + '/static/gulp/',
	'echo copy static to current branch finished',

]));