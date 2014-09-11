var sourceFiles = 'src/**/*.ts';
var sourcePath = 'src';
var testFiles = 'tests/**/*.ts';
var testPath = 'tests';
var distPath = 'dist';
var scriptName = 'jquery.ajaxFile';

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var tsc = require('gulp-typescript-compiler');
var spawn = require('child_process').spawn;
var clean = require('gulp-clean');
var taskAsync = require('./taskAsync');
var Q = require('q');
var scriptWrapper = require('./scriptWrapper');

gulp.task('clean-src-and-test', function () {
    return gulp.src([sourcePath + '/**/*.js', testPath + '/**/*.js', sourcePath + '/**/*.map', testPath + '/**/*.map'], { read: false })
        .pipe(clean());
});

gulp.task('clean-build', function () {
    return gulp.src([distPath + '/**/*.js'], { read: false })
        .pipe(clean());
});

var runClient = function (watch) {
    var args = ['node_modules/karma/bin/karma', 'start'];

    if (!watch) {
        args.push('--singleRun');
    }

    return spawn('node', args, { stdio: 'inherit' });
};

var compile = function(filesPattern, output) {
    return gulp.src([filesPattern])
      .pipe(tsc({
          module: '',
          target: 'ES3',
          sourcemap: true,
          logErrors: true
      }))
      .pipe(gulp.dest(output));
};

gulp.task('build-src-ts', function () {
    return compile(sourceFiles, sourcePath);
});

gulp.task('build-test-ts', function () {
    return compile(testFiles, testPath);
});

gulp.task('merge-src-js', function () {
    return gulp.src(sourcePath + '/**/*.js')
                .pipe(concat(scriptName + '.js'))
                .pipe(scriptWrapper.wrap())
                .pipe(gulp.dest(distPath));
});

gulp.task('min-src-js', function () {
    return gulp.src(distPath + '/' + scriptName + '.js')
                .pipe(uglify({ preserveComments: 'some' }))
                .pipe(concat(scriptName + '.min.js'))
                .pipe(gulp.dest(distPath));
});

gulp.task('dev', function () {
    return taskAsync.runSequence(['clean-src-and-test', 'build-src-ts', 'build-test-ts']).then(function () {
        var testTask = runClient(true);
        var buildTask = gulp.watch([sourceFiles, testFiles], ['build-src-ts', 'build-test-ts']);

        return Q.all([testTask, buildTask]);
    });
});

gulp.task('build', function () {
    return taskAsync.runSequence(['clean-src-and-test', 'clean-build', 'build-src-ts', 'merge-src-js', 'min-src-js']);
});

gulp.task('test', function () {
    return taskAsync.runSequence(['clean-src-and-test', 'build-src-ts', 'build-test-ts']).then(function () {
        return runClient();
    });
});