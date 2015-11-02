var config, gulpSSH;
var sshConfig = require('../config').ssh;
var gulp = require('gulp');
var ssh = require('gulp-ssh');
var gulpZip = require('gulp-zip');
var git = require('gulp-git');
var runSequence = require('run-sequence');
var async = require('async');
var moment = require('moment');
var timestamp = moment().format('YYYYMMDD_HHMMSS');

// generate zip async tasks
function zipTasks() {
  function zip(folder) {
    return function(callback) {
      var file = folder + '.zip';

      gulp.src(config.dist + folder + '/**')
        .pipe(gulpZip(file))
        .pipe(gulp.dest(config.dist))
        .on('end', function() {callback(null);});
    };
  }
  return config.folders.map(function(folder) {
    return zip(folder);
  });
}

// excute SSH related tasks in sequence
function sequence(func) {
  return function() {
    return config.folders.reduce(function(pre, cur) {
      return func(cur);
    }, "");
  };
}

// upload via sftp
function sftp(folder) {
  var file = folder + '.zip';

  return gulp.src(config.dist + file)
    .pipe(gulpSSH.sftp('write', config.path + file));
}

// unzip for test
function unzip(folder) {
  var file = folder + '.zip';

  return gulpSSH.shell([
      'cd ' + config.path,
      'unzip -o ' + config.path + file + ' -d ' + config.path + folder,
      'rm -rf ' + config.path + file
    ], {filePath: 'gulp-ssh.log'})
    .pipe(gulp.dest('.'));
}

// add timestamp for deploy
function rename(folder) {
  var file = folder + '.zip';
  var newFile = folder + "-" + timestamp + '.zip';

  return gulpSSH.shell([
      'cd ' + config.path,
      'mv ' + config.path + file + ' ' + config.path + newFile
    ], {filePath: 'gulp-ssh.log'})
    .pipe(gulp.dest('.'));
}

// add git dev branch name to dir name (for parallel test convinent)
function renameTasks(branch) {
  function rename(folder) {
    return function(callback) {
        var dir = folder;
        //var newDir = folder + "-" + branch;
        var newDir = folder;
        gulpSSH.shell([
            'cd ' + config.path,
            'rm -rf ' + config.path + newDir,
            'mv ' + config.path + dir + ' ' + config.path + newDir
          ], {filePath: 'gulp-ssh.log'})
          .pipe(gulp.dest('.'))
          .on('end', function() {callback(null);});
    };
  }
  return config.folders.map(function(folder) {
    return rename(folder);
  });
	//return rename("static");
}

gulp.task('zip', function (cb) {
  async.parallel(zipTasks(), cb);
});

gulp.task('sftp', function (cb) {
  return sequence(sftp)();
});

gulp.task('unzip', function (cb) {
  return sequence(unzip)();
});

gulp.task('rename', function (cb) {
  return sequence(rename)();
});

gulp.task('renameDir', function (cb) {
  git.revParse({args: '--abbrev-ref HEAD'}, function (err, branch) {
    if (branch === "master") {
      cb(null);
    } else {
      async.series(renameTasks(branch), cb);
    }
  });
});

gulp.task('upload', function() {
  var param = process.argv[process.argv.length - 1];

  config = sshConfig[param];
  gulpSSH = ssh({
    ignoreErrors: false,
    sshConfig: config.sshConfig
  });
  if (param === 'test') {
    //runSequence('build', 'zip', 'sftp', 'unzip', 'renameDir');
    runSequence('build', 'zip', 'sftp', 'unzip');
  } else if (param === 'deploy') {
    runSequence('build', 'zip', 'sftp', 'rename');
  }
});
