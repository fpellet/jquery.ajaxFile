var sourceFiles = 'src/**/*.ts';
var sourcePath = 'src';
var testFiles = 'tests/**/*.ts';
var testPath = 'tests';
var distPath = 'dist';
var scriptName = 'ajaxFile';

var typescriptConfiguration = {
    module: '',
    target: 'ES3',
    sourcemap: true,
    logErrors: true
};

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var tsc = require('gulp-typescript-compiler');
var spawn = require('child_process').spawn;
var clean = require('gulp-clean');
var Q = require('q');
var plumber = require('gulp-plumber');
var watch = require('gulp-watch');
var rename = require("gulp-rename");

var taskAsync = require('./taskAsync');
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
      .pipe(tsc(typescriptConfiguration))
      .pipe(gulp.dest(output));
};

gulp.task('build-src-ts', function () {
    return compile(sourceFiles, sourcePath);
});

gulp.task('build-test-ts', function () {
    return compile(testFiles, testPath);
});

gulp.task('merge-src-js', function () {
    return gulp.src(sourcePath + '/*.js')
                .pipe(concat(scriptName + '.js'))
                .pipe(scriptWrapper.wrap())
                .pipe(gulp.dest(distPath));
});

gulp.task('merge-src-js-with-jquery', function () {
    return gulp.src(sourcePath + '/**/*.js')
                .pipe(concat(scriptName + '.jquery.js'))
                .pipe(scriptWrapper.wrap())
                .pipe(gulp.dest(distPath));
});

gulp.task('min-src-js', function () {
    return gulp.src(distPath + '/*.js')
                .pipe(uglify({ preserveComments: 'some' }))
                .pipe(rename(function (path) {
                    path.extname = '.min.js';
                }))
                .pipe(gulp.dest(distPath));
});

gulp.task('watch-build', function () {
    watch(testFiles)
        .pipe(plumber())
        .pipe(tsc(typescriptConfiguration))
        .pipe(gulp.dest(testPath));

    watch(sourceFiles)
        .pipe(plumber())
        .pipe(tsc(typescriptConfiguration))
        .pipe(gulp.dest(sourcePath));
});

gulp.task('dev', function () {
    return taskAsync.runSequence(['clean-src-and-test', 'build-src-ts', 'build-test-ts', 'watch-build']).then(function () {
        return runClient(true);
    });
});

gulp.task('build', function () {
    return taskAsync.runSequence(['clean-src-and-test', 'clean-build', 'build-src-ts', 'merge-src-js', 'merge-src-js-with-jquery', 'min-src-js']);
});

gulp.task('test', function () {
    return taskAsync.runSequence(['clean-src-and-test', 'build-src-ts', 'build-test-ts']).then(function () {
        return runClient();
    });
});