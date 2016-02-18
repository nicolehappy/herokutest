module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    srcFolder: 'src/main/resources',
    testFolder: 'src/test/resources',
    distFolder: 'target/classes',
    validation: {
      options: {
        reset: grunt.option('reset') || true,
        stoponerror: false,
        failHard: true,
        generateReport: true,
        useTimeStamp: true,
        errorHTMLRootDir: 'w3c',
        path: 'w3c/validation-status.json',
        reportpath: 'w3c/validation-report.json',
        relaxerror: ['The Content-Type was “text/html”. Using the HTML parser.', 'Using the schema for HTML with SVG 1.1, MathML 3.0, RDFa 1.1, and ITS 2.0 support.', 'Bad value X-UA-Compatible for attribute http-equiv on element meta.'] //ignores these errors
      },
      files: {
        src: '<%= srcFolder %>/public/**/*.html'
      }
    },
    jshint: {
      files: ['Gruntfile.js', '<%= srcFolder %>/public/js/**/*.js', '<%= testFolder %>/public/js/**/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['<%= srcFolder %>/public/js/**/*.js'],
        dest: '<%= distFolder %>/public/js/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          '<%= distFolder %>/public/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    qunit: {
      files: ['<%= testFolder %>/public/**/*.html']
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: '<%= srcFolder %>/',
          src: ['public/stylesheets/**/*.css', '!public/stylesheets/**/*.min.css'],
          dest: '<%= distFolder %>',
          ext: '.min.css'
        }]
      }
    }
  });


  // grunt.loadNpmTasks('grunt-html-validation');
  grunt.loadNpmTasks('grunt-w3c-html-validation');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // this would be run by typing "grunt test" on the command line
  grunt.registerTask('test', ['validation', 'jshint']);

  // the default task can be run just by typing "grunt" on the command line
  grunt.registerTask('default', ['validation', 'jshint'/*, 'concat', 'uglify', 'cssmin'*/]);
};