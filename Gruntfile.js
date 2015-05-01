var appname = "Printy";
var devFiles = ['app/app.js',
          'app/services/**/*.js',
          'app/filters/**/*.js',
          'app/directives/**/*.js',
          'app/controllers/**/*.js'
        ];
var ngTemplates = {};
ngTemplates[appname] = {
  src: ['app/templates/**/*.html'],
  dest: 'temp/templates.js'
};
var ngminFiles = function () {
  var files = {};
  files['dist/' + appname + '.js']        = ['temp/' + appname + '.js'];
  files['dist/' + appname + '-bundle.js'] = ['temp/' + appname + '-bundle.js'];
  return files;
};
var uglifyFiles = function() {
  var files = {};
  files['dist/' + appname + '.min.js']        = ['dist/' + appname + '.js'];
  files['dist/' + appname + '-bundle.min.js'] = ['dist/' + appname + '-bundle.js'];
  return files;
};

var devFilesPlusTemplates = devFiles.concat( [ngTemplates[appname].src, 'app/stylesheets/**/*.css'] );

var karmaFiles = [
  'components/jquery/jquery.min.js',
  'components/angular/angular.js',
  'components/angular-mocks/angular-mocks.js',
  'components/underscore/underscore-min.js',
  'components/angular-sanitize/angular-sanitize.min.js',
  'app/**/*.js',
  'test/**/*.js'
];

module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      dev: { src: devFiles }
    },
    concat: {
      js: {
        src: ['app/app.js',
          'app/services/**/*.js',
          'app/filters/**/*.js',
          'app/directives/**/*.js',
          'app/controllers/**/*.js',
          'temp/templates.js',
        ],
        dest: 'temp/' + appname + '.js'
      },
      jsBundle: {
        src: [
          //'components/jquery/jquery.js',
          'components/angular/angular.js',
          'components/angular-sanitize/angular-sanitize.min.js',
          'components/underscore/underscore.js',
        ],
        dest: 'temp/' + appname + '-bundle.js'
      },
      css: {
        src: [ "app/stylesheets/packing.css" ],
        dest: 'temp/' + appname + '.css'
      },
      cssBundle: {
        src: [
          "components/bootstrap-css/css/bootstrap.css",
          "components/components-font-awesome/css/font-awesome.min.css",
          "app/stylesheets/alert-modal.css"
        ],
        dest: 'temp/' + appname + '-bundle.css'
      }
    },
    connect: {
      server: {
        options: {
          base: '.',
          port: 3020,
          middleware: function (connect, options, middlewares) {
            middlewares.unshift(function (req, res, next) {
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', '*');
              return next();
            });
            return middlewares;
          }
        }
      }
    },
    watch: {
      dev: {
        files: devFilesPlusTemplates,
        tasks: ['jshint', 'ngtemplates', 'concat', 'copy']
      }
    },
    ngtemplates: ngTemplates,
    ngmin: {
      dist: {
        files: ngminFiles()
      }
    },
    cssmin: {
      css:{
        src: 'temp/' + appname + '.css',
        dest: 'dist/' + appname + '.min.css'
      },
      cssBundle: {
        src: 'temp/' + appname + '-bundle.css',
        dest: 'dist/' + appname + '-bundle.min.css'
      }
    },
    uglify: {
      dist: {
        files: uglifyFiles()
      }
    },
    karma: {
      unit: {
        options: {
          frameworks: ['jasmine'],
          files: karmaFiles,
          singleRun: false,
          autoWatch: true,
          browsers: ['Chrome'],
          reporters: ['progress']
        }
      },
      dist: {
        options: {
          frameworks: ['jasmine'],
          files: karmaFiles,
          singleRun: true,
          autoWatch: false,
          browsers: ['Chrome'],
          reporters: ['progress']
        }
      }
    },
    copy: {
      main: {
        files: [
          {src: 'components/angular-sanitize/angular-sanitize.min.js.map', dest: 'temp/angular-sanitize.min.js.map'},
          {src: 'temp/' + appname + '.js',         dest: 'temp/' + appname + '.min.js'},
          {src: 'temp/' + appname + '-bundle.js',  dest: 'temp/' + appname + '-bundle.min.js'},
          {src: 'temp/' + appname + '.css',        dest: 'temp/' + appname + '.min.css'},
          {src: 'temp/' + appname + '-bundle.css', dest: 'temp/' + appname + '-bundle.min.css'}
        ]
      },
      dist: { }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('server',  ['jshint', 'ngtemplates', 'concat', 'copy', 'connect', 'watch']);
  grunt.registerTask('test',    ['karma:unit']);
  //grunt.registerTask('default', ['jshint', 'ngtemplates', 'replace', 'concat', 'copy']);
  grunt.registerTask('default', ['jshint', 'ngtemplates', 'concat', 'copy']);
  grunt.registerTask('dist',    ['jshint', 'karma:dist', 'ngtemplates',
    //'replace', 'concat', 'copy', 'ngmin', 'uglify', 'cssmin']);
    'concat', 'copy', 'ngmin', 'uglify', 'cssmin']);
}
