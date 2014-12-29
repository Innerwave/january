/*global module:false*/ 
module.exports = function (grunt) { 

    // Print a timestamp (useful for when watching)
    grunt.registerTask('timestamp', function () {
      grunt.log.subhead( Date().toString().green ); 
    });
  
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
                banner: '<%= banner %>',
                stripBanners: true
                    //, separator: ';'
            },
            dist: {
                src: [
                  'src/js/spreadsheet.js'
                ],
                dest: 'dist/js/<%= pkg.name %>.js'
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
              files : {
                'dist/js/innerwave.scroller.min.js' : 'src/js/scroller.js',
                'dist/js/innerwave.sheet.min.js' : 'src/js/spreadsheet.js'
              }
                // src: '<%= concat.dist.dest %>',
                // dest: 'dist/js/<%= pkg.name %>.min.js'
            }
//          ,
//            vendor: {
//                expand: true,
//                cwd: 'lib',
//                src: '**/*.js',
//                dest: 'dist/lib' 
//            }

        },
        jshint: {
            gruntfile: {
                src: ['Gruntfile.js']
            },
            lib_test: {
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
                tasks: ['timestamp', 'jshint:gruntfile', 'shell:patch', 'shell:svn-versioning']
            },
            lib_test: {
                files: ['<%= jshint.lib_test.src %>', 'src/css/**/*.css', 'test/**/*.html', '*.html'],
                tasks: ['timestamp', 'jsbeautifier', 'jshint:lib_test', 'qunit', 'shell:patch', 'shell:svn-versioning']
            }
        },

        bower: {
            dist: {
                options: {
                    targetDir: 'dist/lib'
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
            files: ['package.json', 'bower.json', "src/js/**/*.js", 'src/css/**/*.css', '*.html', "test/**/*.js", 'test/**/*.html'],
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

      shell: {
          'patch' : [
            'grunt version:patch:"SNAPSHOT"'
          ],
          'minor' : [ 
            'grunt version:minor:"SNAPSHOT"'
          ],
          'major' : [
            'grunt version:major:"RELEASE"'
          ],
          'svn-commit' : [
            'svn commit -m "chore(release): v%version%"'
          ],
          'svn-versioning' : [
            'svn commit -m "chore(versioning): v%version%"'
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
    grunt.registerTask('default', ['jshint', 'qunit', 'clean', 'concat', 'uglify', 'cssmin', 'shell:svn-commit']);
    grunt.registerTask('minor', ['shell:minor', 'shell:svn-commit']);
    grunt.registerTask('major', ['shell:major', 'shell:svn-commit']);
  
    grunt.registerTask('release', []);


  function setVersion(type, suffix) {
    var file = 'package.json';
    var contents = grunt.file.read(file);
    var VERSION_REGEX = /([\'|\"]version[\'|\"][ ]*:[ ]*[\'|\"])([\d|.]*)(-\w+)*([\'|\"])/;
    var version;
    contents = contents.replace(VERSION_REGEX, function(match, left, center) {
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

    function _version(file, search, version){
      contents = grunt.file.read(file);
      contents = contents.replace(search, version);
      grunt.file.write(file, contents);
    }
    // bower.json
    _version('bower.json', VERSION_REGEX, '"version": "'+version +'"');
    
    // distro
    VERSION_REGEX = new RegExp('(\\d+\\.?){3}-'+suffix, 'gi');
    // JS
    var files = grunt.config.get('uglify.dist.files');
    for (var dist in files) {
      // grunt.log.ok(files[dist]); 
      _version(files[dist], VERSION_REGEX, version);
    } 

    // CSS
    _version('src/css/spreadsheet.css', VERSION_REGEX, version);
    
    // HTML
    _version('index.html', VERSION_REGEX, version);

    grunt.log.ok('Version set to ' + version.cyan);

    return version;
  }
  
  grunt.registerTask('version', 'Set version. If no arguments, it just takes off suffix', function() {
    var version = setVersion(this.args[0], this.args[1]);
    grunt.log.ok('version task is invoked : ' + version.cyan);
  }); 

  grunt.registerMultiTask('shell', 'run shell commands', function() {
    //    var self = this;
    var shelljs = require('shelljs');
    this.data.forEach(function(cmd) {
      cmd = cmd.replace('%version%', grunt.file.readJSON('package.json').version);
      grunt.log.ok(cmd);
      var result = shelljs.exec(cmd,{silent:true});
      if (result.code !== 0) {
        grunt.fatal(result.output);
      }
    });
  });
  
  grunt.registerTask('setdist', 'prepare distro directory', function(){
    var distdir = this.args[0] ? grunt.config(this.args[0]+'dir') : 'build'+'dir';
    grunt.config('distdir', distdir);
    grunt.log.ok('Set distdir = ' + distdir);
  });
  
  return grunt;
  
  

};
