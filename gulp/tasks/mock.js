var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var http = require('http');
var _ = require('lodash');
var child_process = require('child_process');
var globby = require('globby');

gulp.task('mock', function() {
    var children = process.__mock_processes__;
    if (!children) {
        children = process.__mock_processes__ = {};
    }

    globby(['./mocks/*'], function(err, files) {
        var port = 8000,
            start = function() {
                var child = children[port] = child_process.fork(path.join(__dirname, '../util/mocker_server.js'));
                child.send({
                    port: port,
                    files: files
                });
                child.on('message', function(msg) {});
            },
            kill = function() {
                if (children[port]) {
                    children[port].kill();
                }
            };

        if (children[port]) {
            kill();
            start();
            return;
        }
        process.on('SIGINT', function() {
            console.log('Mock server got interruped');
            kill();
            process.exit(0);
        });

        start();
    });
});