/*global module:false*/
module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    clean: {
      files: ['dist']
    },
    concat: {
      options: {
        stripBanners: true,
        banner: '<%= banner %>',
        separator: ';'
      },
      dist: {
        files: {
          'dist/js/innerwave.scroller.min.js': 'src/js/scroller.js',
          'dist/js/<%= pkg.name %>.js': 'src/js/spreadsheet.js'
        }
      }
    },
    uglify: {
      dist: {
        options: {
          banner: '<%= banner %>',
          compress: {
            drop_console: true
          }
        },
        files: '<%= concat.dist.files %>'
      }
    },
    jshint: {
      gruntfile: {
        src: ['Gruntfile.js']
      },
      scripts: {
        options: {
          curly: true,
          eqeqeq: true,
          immed: true,
          latedef: false,
          newcap: true,
          noarg: true,
          sub: true,
          undef: false,
          unused: false,
          boss: true,
          eqnull: true,
          browser: true,
          globals: {
            "console": true,
            "jQuery": true,
            "require": true
          }
        },
        src: ['package.json', 'bower.json', 'src/js/**/*.js', 'test/**/*.js']
      }
    },

    qunit: {
      files: ['test/**/*.html']
    },

    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['timestamp', 'jshint:gruntfile', 'shell:patch', 'shell:git-commit'] // 'shell:svn-versioning']
      },
      scripts: {
        files: ['<%= jshint.scripts.src %>', 'src/css/**/*.css', 'test/**/*.html', '*.html'],
        tasks: ['timestamp', 'jsbeautifier', 'jshint:scripts', 'qunit', 'shell:patch', 'shell:git-commit'] //, 'shell:svn-versioning'] //
      }
    },

    // 제대로된 설치가 이루어지지 않는다.
    // 개발에서는 bower_components 이하의 것을 사용하고 배포 스크립트를 작성하여 맞추어야 한다.
    bower: {
      install: {
        options: {
          targetDir: './dist/lib',
          layout: 'byComponent',
          install: true,
          verbose: false,
          cleanTargetDir: false,
          cleanBowerDir: false,
          bowerOptions: {}
        }
      }
    },

    cssmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/css/',
          src: ['*.css'],
          dest: 'dist/css/',
          ext: '.min.css'
        }]
      }
    },

    connect: {
      dist: {
        options: {
          hostname: 'localhost',
          protocol: 'http',
          port: 9000,
          base: '.',
          keepalive: true
        }
      },
      server: {
        options: {
          port: 8000,
          hostname: '*',
          onCreateServer: function (server, connect, options) {
            var io = require('socket.io').listen(server);
            io.sockets.on('connection', function (socket) {
              // do something with socket
            });
          },
          middleware: [
            function myMiddleware(req, res, next) {
              res.end('Hello, world!');
            }
          ]
        }
      }
    },

    jsbeautifier: {
      files: ['Gruntfile.js', 'package.json', 'bower.json', "src/js/**/*.js", 'src/css/**/*.css', '*.html', "test/**/*.js", 'test/**/*.html'],
      options: {
        //config: "path/to/configFile",
        html: {
          braceStyle: "collapse",
          indentChar: " ",
          indentScripts: "keep",
          indentSize: 2,
          maxPreserveNewlines: 10,
          preserveNewlines: true,
          unformatted: ["a", "sub", "sup", "b", "i", "u"],
          wrapLineLength: 0
        },
        css: {
          indentChar: " ",
          indentSize: 4
        },
        js: {
          braceStyle: "collapse",
          breakChainedMethods: false,
          e4x: false,
          evalCode: false,
          indentChar: " ",
          indentLevel: 0,
          indentSize: 2,
          indentWithTabs: false,
          jslintHappy: true,
          keepArrayIndentation: false,
          keepFunctionIndentation: false,
          maxPreserveNewlines: 10,
          preserveNewlines: true,
          spaceBeforeConditional: true,
          spaceInParen: false,
          unescapeStrings: false,
          wrapLineLength: 0
        }
      }
    },

    shell: { // 실행시 변경된 최신의 버전 넘버링을 참조하기 위해
      'patch': [
        'grunt version:patch:"SNAPSHOT"'
      ],
      'minor': [
        'grunt version:minor:"BETA"'
      ],
      'major': [
        'grunt version:major:"RELEASE"'
      ],
      'svn-commit': [
        'svn commit -m "chore(release): v%version%"'
      ],
      'svn-versioning': [
        'svn commit -m "chore(versioning): v%version%"'
      ],
      'copy-example': [
        'cp -f index.html dist/index.html'
      ],
      'git-commit': [
        'git add .',
        'git commit -m "work history : v%version%"'
      ]
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.loadNpmTasks('grunt-jsbeautifier');

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit', 'clean', 'bower', 'concat', 'uglify', 'cssmin']);
  grunt.registerTask('minor', ['shell:minor']);
  grunt.registerTask('major', ['shell:major']);

  function replace(file, search, replacement) {
    contents = grunt.file.read(file);
    contents = contents.replace(search, replacement);
    grunt.file.write(file, contents);
  }

  function exec(cmd) {
    var shelljs = require('shelljs');
    var result = shelljs.exec(cmd, {
      silent: true
    });
    grunt.log.ok(cmd);
    if (result.code !== 0) {
      grunt.fatal(result.output);
    }
    return result;
  }

  function setVersion(type, suffix) {
    var file = 'package.json';
    var contents = grunt.file.read(file);
    var VERSION_REGEX = /([\'|\"]version[\'|\"][ ]*:[ ]*[\'|\"])([\d|.]*)(-\w+)*([\'|\"])/;
    var version;
    contents = contents.replace(VERSION_REGEX, function (match, left, center) {
      version = center;
      if (type) {
        version = require('semver').inc(version, type);
      }
      if (suffix) {
        version += '-' + suffix;
      }
      return left + version + '"';
    });
    grunt.file.write(file, contents);

    // bower.json
    replace('bower.json', VERSION_REGEX, '"version": "' + version + '"');

    // SOURCE
    VERSION_REGEX = new RegExp('(\\d+\\.?){3}-' + suffix, 'gi');

    // JS
    var files = grunt.config.get('uglify.dist.files');
    for (var dist in files) {
      replace(files[dist], VERSION_REGEX, version);
    }
    // CSS
    replace('src/css/spreadsheet.css', VERSION_REGEX, version);
    // HTML
    replace('index.html', VERSION_REGEX, version);
    grunt.log.ok('Version set to ' + version.cyan);
    return version;
  }

  grunt.registerTask('make', ['bower', 'concat', 'uglify', 'cssmin', 'examples']);

  grunt.registerTask('examples', function () {
    var src = 'index.html';
    var dest = 'dist/index.html';

    exec('cp -f ' + src + ' ' + dest);

    replace(dest, /bower_components/g, 'lib');
    replace(dest, /src\//g, '');
    replace(dest, /jquery\/dist/g, 'jquery');
    replace(dest, /font-awesome\/css/g, 'font-awesome');
    replace('dist\/lib/font-awesome\/font-awesome.css', /\.\.\/fonts\//g, '');
    replace(dest, /spreadsheet\.js/g, 'innerwave.sheet.min.js');
    replace(dest, /scroller\.js/g, 'innerwave.scroller.min.js');
    replace(dest, /spreadsheet\.css/g, 'spreadsheet.min.css');
    exec('cp -rf bower_components/jquery-ui/themes dist/lib/jquery-ui/themes');
  });

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function () {
    grunt.log.subhead(Date().toString().green);
  });

  grunt.registerTask('version', 'Set version. If no arguments, it just takes off suffix', function () {
    var version = setVersion(this.args[0], this.args[1]);
    grunt.log.ok('version task is invoked : ' + version.cyan);
  });

  grunt.registerMultiTask('shell', 'run shell commands', function () {
    var shelljs = require('shelljs');
    this.data.forEach(function (cmd) {
      cmd = cmd.replace('%version%', grunt.file.readJSON('package.json').version);
      grunt.log.ok(cmd);
      var result = shelljs.exec(cmd, {
        silent: true
      });
      if (result.code !== 0) {
        grunt.fatal(result.output);
      }
    });
  });

  return grunt;
};
