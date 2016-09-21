var istanbul = require("browserify-istanbul");
module.exports = function(config) {
  config.set({
    files: [
      'node_modules/jquery/dist/jquery.js',
      'js/HttpRequest.js',
      'spec/**/*_spec.js'
    ],
    frameworks: ['browserify', 'jasmine'],
    preprocessors: {
      'js/**/*.js': ['browserify'],
      'spec/**/*_spec.js': ['browserify']
    },
    browsers: ['Chrome'],
    reporters: ['coverage', 'spec', 'failed'],
    logLevel:config.LOG_INFO,
    coverageReporter: {
      reporters: [
        {
          type: 'text-summary'
        }/*,
        {
          type: 'html',
          dir: 'coverage'
        }*/
      ]
    },
    client:{
      captureConsole:true
    },
    browserify: {
      debug: true,
      transform: ['babelify',istanbul({
        ignore:["**/spec/**"]
      })]
    }
  })
};