const gulp = require('gulp');
const eslint = require('gulp-eslint');
const environments = require('gulp-environments');

var task = function () {
    return gulp.src(['./src/**/*.js.flow', '!node_modules', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format('node_modules/eslint-formatter-pretty'))
        .pipe(eslint.failAfterError());
};

module.exports = task;
