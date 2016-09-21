var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');

gulp.task('compress', ['compile2es5'],function (cb) {
  pump([
        gulp.src('dist/**/*.js'),
        uglify(),
        gulp.dest('dist_min')
    ],
    cb
  );
});