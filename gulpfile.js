var sourceFilesWithoutJQuery = 'src/*.ts';
var sourceFilesWithJQuery = 'src/**/*.ts';

var scriptNameWithoutJquery = 'ajaxFile';
var scriptNameWithJquery = scriptNameWithoutJquery + '.jquery';

var testFiles = 'tests/**/*.ts';
var testPath = 'tests';
var scriptNameForTest = 'merge.js';

var distPath = 'dist';


var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var spawn = require('child_process').spawn;
var watch = require('gulp-watch');
var del = require('del');
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var batch = require('gulp-batch');
var tslint = require('gulp-tslint');

var taskAsync = require('./taskAsync');
var scriptWrapper = require('./scriptWrapper');

gulp.task('clean-build', function (done) {
    return del(distPath, done);
});

var compileTypeScriptSources = function(sourceFiles, outputName) {
    return gulp
        .src(sourceFiles)
        .pipe(sourcemaps.init())
            .pipe(typescript())
            .pipe(concat(outputName + '.js'))
            .pipe(scriptWrapper.wrap())
            .pipe(gulp.dest(distPath))
            .pipe(uglify({ preserveComments: 'some' }))
            .pipe(concat(outputName + '.min.js'))
		.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(distPath));
};

gulp.task('build-src-ts-without-jquery', function() {
    return compileTypeScriptSources(sourceFilesWithoutJQuery, scriptNameWithoutJquery);
});

gulp.task('build-src-ts-with-jquery', function () {
    return compileTypeScriptSources(sourceFilesWithJQuery, scriptNameWithJquery);
});

gulp.task('build-src-ts', ['build-src-ts-without-jquery', 'build-src-ts-with-jquery']);

gulp.task('build', function () {
    return taskAsync.runSequence(['clean-build', 'build-src-ts']);
});

gulp.task('build-test-ts', function () {
    return gulp.src([sourceFilesWithJQuery, testFiles])
        .pipe(sourcemaps.init())
            .pipe(typescript())
            .pipe(concat(scriptNameForTest))
		.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(testPath));
});

gulp.task('check-ts', function() {
    return gulp.src([sourceFilesWithJQuery, testFiles])
			.pipe(tslint())
			.pipe(tslint.report('verbose'));
});

gulp.task('watch-ts', function () {
    watch([testFiles, sourceFilesWithJQuery], batch(function (events, done) {
        gulp.start('build-test-ts', done);
    }));
});

var runClient = function (watch) {
    var args = ['node_modules/karma/bin/karma', 'start'];

    if (!watch) {
        args.push('--singleRun');
    }

    return spawn('node', args, { stdio: 'inherit' });
};

gulp.task('dev', function () {
    return taskAsync.runSequence(['build-test-ts', 'watch-ts']).then(function () {
        return runClient(true);
    });
});

gulp.task('test', ['build-test-ts'], function () {
    return runClient();
});