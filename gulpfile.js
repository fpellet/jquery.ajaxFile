var sourceFilesWithoutJQuery = 'src/*.ts';
var sourceFilesWithJQuery = 'src/**/*.ts';
var sourceFilesOfKnockoutPlugin = 'plugin/*.ts';

var scriptNameWithoutJquery = 'ajaxFile';
var scriptNameWithJquery = scriptNameWithoutJquery + '.jquery';
var scriptNameOfKnockoutPlugin = 'ajaxFile.knockout';

var testFiles = 'tests/**/*.ts';
var testPath = 'tests';
var scriptNameForTest = 'merge.js';

var distPath = 'dist';

var externalLibTypingFile = "typings/tsd.d.ts";


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

var compileTypeScriptSources = function (sourceFiles, outputName, wrapper) {
    wrapper = wrapper || scriptWrapper.wrap;

    return gulp
        .src([sourceFiles, externalLibTypingFile])
        .pipe(sourcemaps.init())
            .pipe(typescript())
            .pipe(concat(outputName + '.js'))
            .pipe(wrapper())
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

gulp.task('build-src-ts-plugin-ko', function () {
    return compileTypeScriptSources(sourceFilesOfKnockoutPlugin, scriptNameOfKnockoutPlugin, scriptWrapper.wrapForKnockoutPlugin);
});

gulp.task('build-src-ts', ['build-src-ts-without-jquery', 'build-src-ts-with-jquery', 'build-src-ts-plugin-ko']);

gulp.task('build', function () {
    return taskAsync.runSequence(['clean-build', 'build-src-ts']);
});

gulp.task('build-test-ts', function () {
    return gulp.src([sourceFilesWithJQuery, testFiles, externalLibTypingFile])
        .pipe(sourcemaps.init())
            .pipe(typescript())
            .pipe(concat(scriptNameForTest))
		.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(testPath));
});

gulp.task('check-ts', function() {
    return gulp.src([sourceFilesWithJQuery, testFiles, sourceFilesOfKnockoutPlugin])
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