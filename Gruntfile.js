'use strict';

module.exports = function(grunt) {

    var transport = require('grunt-cmd-transport');
    var style = transport.style.init(grunt);
    var text = transport.style.init(grunt);
    var script = transport.script.init(grunt);
    var bootstrapGenerateCommonJSModule = require('./grunt/bootstrap-bs-commonjs-generator.js');
    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg : grunt.file.readJSON('package.json'),
        banner : '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        copy : {
            // assets 为静态文件的目录，存放编译打包后的js&css
            sea: {
                files : [{
                    expand : true,
                    cwd : 'lib/',
                    src : ['sea.js', 'seajs-style/**'],
                    dest : 'assets'
                }]
            },
            /*
             * 避免`transport`依赖出错需事先将模块cp到assets下面
             */
            underscore: {
                files: [{
                    expand: true,
                    cwd: 'lib/',
                    src: ['underscore/1.6.0/underscore.js'],
                    dest: 'assets'
                }]
            },
            jquery: {
                files: [{
                    expand: true,
                    cwd: 'lib/',
                    src: ['jquery/1.10.1/jquery.js'],
                    dest: 'assets'
                }]
            },
            bootstrap: {
                files : [{
                    expand : true,
                    cwd : 'lib/',
                    src : [
                        'bootstrap/3.3.2/js/transition.js',
                        'bootstrap/3.3.2/js/alert.js',
                        'bootstrap/3.3.2/js/button.js',
                        'bootstrap/3.3.2/js/carousel.js',
                        'bootstrap/3.3.2/js/collapse.js',
                        'bootstrap/3.3.2/js/dropdown.js',
                        'bootstrap/3.3.2/js/modal.js',
                        'bootstrap/3.3.2/js/tooltip.js',
                        'bootstrap/3.3.2/js/popover.js',
                        'bootstrap/3.3.2/js/scrollspy.js',
                        'bootstrap/3.3.2/js/tab.js',
                        'bootstrap/3.3.2/js/affix.js'
                    ],
                    dest : 'assets'
                }]
            }
        },
        rename: {
            jquery: {
                src: 'assets/jquery/1.10.1/jquery.js',
                dest: 'assets/jquery/1.10.1/jquery-debug.js'
            },
            underscore: {
                src: 'assets/underscore/1.6.0/underscore.js',
                dest: 'assets/underscore/1.6.0/underscore-debug.js'
            },
            backbone: {
                src: 'assets/backbone/1.1.2/backbone.js',
                dest: 'assets/backbone/1.1.2/backbone-debug.js'
            }
        },
        transport : {
            options : {
                debug : false,
                alias : '<%= pkg.alias %>',
                parsers : {
                    '.js' : [script.jsParser],
                    '.css' : [style.css2jsParser]
                },
                paths : ['assets']
            },
            backbone : {
                options : {
                    idleading : 'backbone/1.1.2/'
                },
                files : [{
                    expand : true,
                    filter : 'isFile',
                    cwd : 'lib/backbone/1.1.2',
                    src : 'backbone.js',
                    dest : 'assets/backbone/1.1.2'
                }]
            }
        },
        less: {
            bootstrap_compileCore: {
                options: {
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: 'bootstrap.css.map',
                    sourceMapFilename: 'assets/bootstrap/3.3.2/bootstrap.css.map'
                },
                src: 'lib/bootstrap/3.3.2/less/bootstrap.less',
                dest: 'assets/bootstrap/3.3.2/bootstrap-debug.css'
            },
            bootstrap_compileTheme: {
                options: {
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: 'bootstrap-theme.css.map',
                    sourceMapFilename: 'assets/bootstrap/3.3.2/bootstrap-theme.css.map'
                },
                src: 'lib/bootstrap/3.3.2/less/theme.less',
                dest: 'assets/bootstrap/3.3.2/bootstrap-theme-debug.css'
            }
        },
        autoprefixer: {
            options: {
                browsers: [
                    "Android 2.3",
                    "Android >= 4",
                    "Chrome >= 20",
                    "Firefox >= 24",
                    "Explorer >= 8",
                    "iOS >= 6",
                    "Opera >= 12",
                    "Safari >= 6"
                ]
            },
            bootstrap_core: {
                options: {
                    map: true
                },
                src: 'assets/bootstrap/3.3.2/bootstrap-debug.css'
            },
            bootstrap_theme: {
                options: {
                    map: true
                },
                src: 'assets/bootstrap/3.3.2/bootstrap-theme-debug.css'
            }
        },
        css_import: {
            compress: {
                files: {
                    'assets/global/1.0.0/index.css': ['static/css/global/1.0.0/index.css']
                }
            }
        },
        cssmin: {
            options: {
                //keepSpecialComments: 0
            },
            minify: {
                expand: true,
                cwd: 'assets/',
                src: ['global/**/index.css'],
                dest: 'assets/',
                ext: '.css'
            },
            bootstrap_minifyCore: {
                src: 'assets/bootstrap/3.3.2/bootstrap-debug.css',
                dest: 'assets/bootstrap/3.3.2/bootstrap.css'
            },
            bootstrap_minifyTheme: {
                src: 'assets/bootstrap/3.3.2/bootstrap-theme-debug.css',
                dest: 'assets/bootstrap/3.3.2/bootstrap-theme.css'
            }
        },
        csscomb: {
            options: {
            },
            bootstrap: {
                options: {
                    config: 'less/.csscomb.json'
                },
                expand: true,
                cwd: 'assets/bootstrap/3.3.2',
                src: ['*.css', '!*-debug.css'],
                dest: 'assets/bootstrap/3.3.2/'
            }
        },
        concat : {
            options : {
                paths : ['.'],
                separator: ';'
            },
            bootstrap : {
                options : {
                    noncmd: true
                },
                files: {
                    'assets/bootstrap/3.3.2/bootstrap-debug.js': [
                        'lib/bootstrap/3.3.2/js/transition.js',
                        'lib/bootstrap/3.3.2/js/alert.js',
                        'lib/bootstrap/3.3.2/js/button.js',
                        'lib/bootstrap/3.3.2/js/carousel.js',
                        'lib/bootstrap/3.3.2/js/collapse.js',
                        'lib/bootstrap/3.3.2/js/dropdown.js',
                        'lib/bootstrap/3.3.2/js/modal.js',
                        'lib/bootstrap/3.3.2/js/tooltip.js',
                        'lib/bootstrap/3.3.2/js/popover.js',
                        'lib/bootstrap/3.3.2/js/scrollspy.js',
                        'lib/bootstrap/3.3.2/js/tab.js',
                        'lib/bootstrap/3.3.2/js/affix.js'
                    ]
                }
            }
        },
        uglify : {
            options: {
                mangle: true
            },
            bootstrap: {
                options: {
                    preserveComments: 'some'
                },
                src: 'assets/bootstrap/3.3.2/bootstrap-debug.js',
                dest: 'assets/bootstrap/3.3.2/bootstrap.js'
            },
            jquery: {
                src: 'assets/jquery/1.10.1/jquery-debug.js',
                dest: 'assets/jquery/1.10.1/jquery.js'
            },
            underscore: {
                src: 'assets/underscore/1.6.0/underscore-debug.js',
                dest: 'assets/underscore/1.6.0/underscore.js'
            },
            backbone: {
                src: 'assets/backbone/1.1.2/backbone-debug.js',
                dest: 'assets/backbone/1.1.2/backbone.js'
            },
            compress: {
                files : [{
                    expand : true,
                    cwd : 'assets/',
                    src : [],
                    dest : 'assets/'
                }]
            }
        },
        jshint: {
            options: {
                jshintrc: 'jshint/.jshintrc'
            },
            assets: {
                src: ['lib/*.js', 'lib/**/**/*.js', 'static/js/**/**/*.js']
            }
        },
        clean : {
            temp : []
        },
        watch: {
            style: {
                files: ['static/css/**/*.css'],
                tasks: ['cssmin', 'css_import']
            },
            scripts: {
                files: ['lib/**/**/*.js', 'static/js/**/**/*.js'],
                tasks: ['transport', 'concat', 'uglify']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-csscomb');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-css-import');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-rename');
    // bootstrap js
    grunt.registerTask('bootstrap-dist-js', ['concat:bootstrap', 'uglify:bootstrap', 'bootstrap-commonjs']);
    // bootstrap common js
    grunt.registerTask('bootstrap-commonjs', 'Generate CommonJS entrypoint module in dist dir.', function () {
        var srcFiles = [
            'assets/bootstrap/3.3.2/js/transition.js',
            'assets/bootstrap/3.3.2/js/alert.js',
            'assets/bootstrap/3.3.2/js/button.js',
            'assets/bootstrap/3.3.2/js/carousel.js',
            'assets/bootstrap/3.3.2/js/collapse.js',
            'assets/bootstrap/3.3.2/js/dropdown.js',
            'assets/bootstrap/3.3.2/js/modal.js',
            'assets/bootstrap/3.3.2/js/tooltip.js',
            'assets/bootstrap/3.3.2/js/popover.js',
            'assets/bootstrap/3.3.2/js/scrollspy.js',
            'assets/bootstrap/3.3.2/js/tab.js',
            'assets/bootstrap/3.3.2/js/affix.js'
        ];
        var destFilepath = 'assets/bootstrap/3.3.2/npm.js';
        bootstrapGenerateCommonJSModule(grunt, srcFiles, destFilepath);
    });
    // other js
    grunt.registerTask('other-dist-js', ['uglify:jquery', 'uglify:underscore', 'uglify:backbone', 'uglify:compress']);
    // bootstrap css
    grunt.registerTask('bootstrap-less-compile', ['less:bootstrap_compileCore', 'less:bootstrap_compileTheme']);
    grunt.registerTask('bootstrap-dist-css', ['bootstrap-less-compile', 'autoprefixer:bootstrap_core', 'autoprefixer:bootstrap_theme', 'csscomb:bootstrap', 'cssmin:bootstrap_minifyCore', 'cssmin:bootstrap_minifyTheme']);
    // other css
    grunt.registerTask('other-dist-css', ['css_import', 'cssmin:minify']);
    // other
    grunt.registerTask('other', ['copy', 'transport', 'rename']);
    // Full
    grunt.registerTask('default', ['other', 'bootstrap-dist-js', 'other-dist-js',  'bootstrap-dist-css', 'other-dist-css']);

};
