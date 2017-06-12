const gulp = require('./gulp')(['babel', 'eslint']);
const chmod = require('gulp-chmod');

gulp.task('default', ['build']);

gulp.task('build', ['babel', 'eslint'], () => {
    return gulp.src('./bin/*.js')
        .pipe(chmod(0o755))
        .pipe(gulp.dest('./bin'));
});

gulp.task('watch', ['babel', 'eslint', 'build'], done => {
    gulp.watch(['./**/*.js.flow', '!node_modules', '!node_modules/**'], ['babel']);
});
