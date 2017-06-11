const gulp = require('./gulp')(['babel', 'eslint']);

gulp.task('default', ['build']);

gulp.task('build', ['babel', 'eslint']);

gulp.task('watch', ['babel', 'eslint', 'build'], done => {
    gulp.watch(['./**/*.js.flow', '!node_modules', '!node_modules/**'], ['babel']);
});
