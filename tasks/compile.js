const gulp = require('gulp');
const es6transplier = require("gulp-es6-transpiler");

//gulp.task('clean', () => del('dist'));

gulp.task('compile', () => {
  return gulp.src(['js/**/*.js'])
    .pipe(es6transplier())
    .pipe(gulp.dest('dist'));
});

//gulp.task('compile', ['clean']);
