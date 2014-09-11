'use strict';

var Q = require('q');
var gulp = require('gulp');

var startTask = function (taskName) {
    var deferred = Q.defer();

    gulp.once("task_stop", function () {
        deferred.resolve();
    });

    gulp.start(taskName);

    return deferred.promise;
};

exports.start = startTask;

exports.runSequence = function(taskNames) {
    var sequence = Q.all([]);
    taskNames.forEach(function (taskName) {
        sequence = sequence.then(function () { return startTask(taskName); });
    });

    return sequence;
};