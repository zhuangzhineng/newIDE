const gulp = require('gulp');
const traceur = require('gulp-traceur');
 
 
gulp.task('compile2es5', () => {
	return gulp.src('js/**/**.js')
		.pipe(traceur())
		.pipe(gulp.dest('dist'));
});