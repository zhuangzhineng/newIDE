const gulp = require('gulp');
const Server = require('karma').Server;

gulp.task("karmatest", (done) => {
  return new Server({
    configFile: __dirname + '/../karma.conf.js',
    singleRun: true
  }, done).start();
});
