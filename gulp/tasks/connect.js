var gulp = require('gulp');
var config = require('../config').connect;
var velocityConfig = require('../config').velocity;
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
var app = require('connect')();
var livereload = require('connect-livereload');
var handlebarMiddleware = require("handlebar-middleware");

gulp.task('connect', ['styles', 'images', 'fonts', 'velocity'], function () {

  app.use(livereload({port: 35729}))
    /*.use(handlebarMiddleware({
      source: config.htmlDir,
      fixtures: config.fixtures
    }))*/
		/*.use(vm({
			source: config.htmlDir,
			fixtures: config.fixtures
		}))*/
    .use(serveStatic(config.staticDir))
    .use(serveStatic(velocityConfig.htmlDir))
    .use('/app', serveStatic('app'))
    .use('/node_modules', serveStatic('node_modules'))
    .use('/bower_components', serveStatic('bower_components')) 
    .use(serveIndex(velocityConfig.htmlDir));

  require('http').createServer(app)
    .listen(9000)
    .on('listening', function () {
      // console.log('Started connect web server on http://localhost:9000');
    });
});
