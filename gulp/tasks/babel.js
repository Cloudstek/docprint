const fs = require('fs');
const gulp = require('gulp');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const environments = require('gulp-environments');

var task = function () {
    let babelrc = JSON.parse(fs.readFileSync('.babelrc') || '{}');

    return gulp.src(['./src/**/*.js.flow', '!node_modules', '!node_modules/**'])
        .pipe(babel(babelrc))
        .pipe(rename(path => {
            // Fix file extension for double ext files (.js.flow)
            path.extname = path.basename.endsWith('.js') ? '' : '.js';
        }))
        .pipe(gulp.dest('./src'));
};

module.exports = [[], task];
