/*
 *
 * Copyright (c) 2014 eXist Solutions
 * Licensed under the MIT license.
 */

'use strict';

/* jshint indent: 2 */

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});
//    require('time-grunt')(grunt);

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-contrib-less');


    // Project configuration.
    grunt.initConfig({
        xar: grunt.file.readJSON('package.json'),

        jshint: {
            all: [
                'gruntfile.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['build', 'dist']
        },

        /*
         replaces tokens in expath-pkg.tmpl and creates expath-pkg.xml with substituted values
         */
        replace: {
            pkg: {
                src: ['expath-pkg.tmpl'],
                dest: 'expath-pkg.xml',
                replacements: [
                    {
                        from: '@APPVERSION@',
                        to: '<%= xar.version %>'
                    },
                    {
                        from: '@APPNAME@',
                        to: '<%= xar.name %>'
                    },
                    {
                        from: '@APPDESCRIPTION@',
                        to: '<%= xar.description %>'
                    }
                ]
            },
            repo: {
                src: ['repo.tmpl'],
                dest: 'repo.xml',
                replacements: [
                    {
                        from: '@APPVERSION@',
                        to: '<%= xar.version %>'
                    },
                    {
                        from: '@APPNAME@',
                        to: '<%= xar.name %>'
                    },
                    {
                        from: '@APPDESCRIPTION@',
                        to: '<%= xar.description %>'
                    }
                ]
            }
        },

        /*
         Copy copies all relevant files for building a distribution in 'dist' directory
         */
        // CSS and JS resources are copied as they get processed by their respective optimization tasks later in the chain.
        // png images will not be copied as they will get optimized by imagemin
        copy: {
            dist: {
                files: [
                    {expand: true,
                        cwd: './',
                        src: [  'doc/**',
                                'modules/**',
                                'resources/img/**',
                                'templates/**',
                                '*.xql',
                                '*.xml',
                                '*.txt',
                                '*.ico',
                                '*.html',
                                'resources/js/countdown_v5.0/countdown.js',
                                'resources/js/countdown_v5.0/images/*'],
                        dest: 'dist/'},
                    {expand: true,
                        cwd: './',
                        flatten: true,
                        src: ['components/font-awesome/fonts/**'],
                        dest: 'dist/resources/fonts/',
                        filter: 'isFile'
                        }
                ]
            }
        },

        /*
         optimizes images for the web. Currently only .png files are considered. This might be extended later.
         */
        imagemin: {
            png: {
                options: {
                    optimizationLevel: 7
                },
                files: [
                    {
                        // Set to true to enable the following options…
                        expand: true,
                        // cwd is 'current working directory'
                        cwd: './resources/img/',
                        src: ['**/*.png'],
                        // Could also match cwd line above. i.e. project-directory/img/
                        dest: 'dist/resources/img/',
                        ext: '.png'
                    }
                ]
            }
        },

        /*
         minifies the file 'resources/js/app.js'. Creates a minified version 'app.min.js'. Using a fixed and unconfigurable
         name makes substitution in html page easier - see build comments at the end of html files.
         */
        uglify: {
            index: {
                files: {
                    'resources/js/exist.min.js': [
                        'resources/js/svgicons.js',
                        'resources/js/exist-home.js'
                    ]
                }
            },
            press: {
                files: {
                    'resources/js/press.min.js': [
                        'resources/js/press.js'
                    ]
                }
            },
            timeline: {
                files: {
                    'resources/js/timeline.min.js': [
                        'resources/js/scrollPagination.js',
                        'resources/js/timeline.js',
                        'resources/js/wow.js'
                    ]
                }
            },
            autumn: {
                files: {
                    'resources/js/autumn.min.js': [
                        'resources/js/svgicons.js',
                        'resources/js/exist-home.js'
                    ]
                }
            }

        },

        /*
         concatenates all minified JavaScript files into one. Destination file will be app.min.js
         */
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                stripBanners: true
            },
            index: {
                // the files to concatenate - use explicit filenames here to ensure proper order
                // puts app.js at the end.
                src: [
                    'components/jquery/dist/jquery.min.js',
                    'components/bootstrap/dist/js/bootstrap.min.js',
                    'components/snap.svg/dist/snap.svg-min.js',
                    'resources/js/exist.min.js'],
                // the location of the resulting JS file
                dest: 'dist/resources/js/exist.min.js'
            },
            press: {
                // the files to concatenate - use explicit filenames here to ensure proper order
                // puts app.js at the end.
                src: [
                    'components/jquery/dist/jquery.min.js',
                    'components/bootstrap/dist/js/bootstrap.min.js',
                    'resources/js/press.min.js'],
                // the location of the resulting JS file
                dest: 'dist/resources/js/press.min.js'
            },
            timeline: {
                // the files to concatenate - use explicit filenames here to ensure proper order
                // puts app.js at the end.
                src: [
                    'components/jquery/dist/jquery.min.js',
                    'components/bootstrap/dist/js/bootstrap.min.js',
                    'resources/js/timeline.min.js'],
                // the location of the resulting JS file
                dest: 'dist/resources/js/timeline.min.js'
            },
            training: {
                // the files to concatenate - use explicit filenames here to ensure proper order
                // puts app.js at the end.
                src: [
                    'components/jquery/dist/jquery.min.js',
                    'components/bootstrap/dist/js/bootstrap.min.js'],
                // the location of the resulting JS file
                dest: 'dist/resources/js/training.min.js'
            }
        },

        less: {
            development: {
                options: {
                    strictImports: true
                },
                files: {
                    "resources/css/styles.css": "resources/css/styles.less"
                }
            },
            production: {
                options:{
                    strictImports:true
                },
                files: {
                    "resources/css/styles.css": "resources/css/styles.less"
                }
            },
            timeline: {
                options: {
                    strictImports: true
                },
                files: {
                    "resources/css/timeline.css": "resources/css/timeline.less"
                }
            },
            training: {
                options: {
                    strictImports:true
                },
                files: {
                    "resources/css/training.css": "resources/css/training.less"
                }
            }
        },

        /*
         removes unused CSS rules by investigating the imports of html files. Used to strip down e.g. bootstrap to
         the actual used amount of rules.
         */
        uncss: {
            index: {
                src: ['./index.html'],
                dest: 'resources/css/index.min.css',
                options: {
                    ignore: ['.collapsing',
                        /.exist-.+\b/,
                        /.autumn.+\b/,
                        /.open.+\b/,
                        '.navbar-collapse.collapse',
                        '.collapse.in',
                        /.band-news.+\b/ ,
                        '.animated',
                        'slideInDown',
                        /.autumn.+\b/],
                    flatten: true
                }
            },
            timeline: {
                src: ['timetunnel.html'],
                dest: 'resources/css/timeline.min.css',
                options: {
                    ignore: [
                        /.exist-.+\b/,
                        '.exist-timeline-content',
                        '.exist-timeline-img',
                        '.exist-date',
                        '.exist-read-more',
                        /.open.+\b/,
                        '.navbar-collapse.collapse',
                        '.collapse.in',
                        '.fa-quote-left',
                        '.fa-paper-plane',
                        '.fa-space-shuttle',
                        '.fa-bullhorn',
                        'wow'],
                    flatten: true
                }
            },
            training: {
                src: ['training.html'],
                dest: 'resources/css/training.min.css',
                options: {
                    ignore: [
                        /.exist-.+\b/,
                        /.open.+\b/,
                        '.collapsed',
                        '.collapse.in',
                        '.navbar-collapse.collapse'],
                    flatten: true
                }
            }
        },

        /*
         minify the already cleaned up CSS files
         */
        cssmin: {
            index: {
                options: {
                    compatibility: 'ie8',
                    keepSpecialComments: 0,
                    report: 'min'
                },
                files: {
                    'dist/resources/css/index.min.css': 'resources/css/index.min.css'
                }
            },
            timeline: {
                options: {
                    compatibility: 'ie8',
                    keepSpecialComments: 0,
                    report: 'min'
                },
                files: {
                    'dist/resources/css/timeline.min.css': 'resources/css/timeline.min.css'
                }
            },
            training: {
                options: {
                    compatibility: 'ie8',
                    keepSpecialComments: 0,
                    report: 'min'
                },
                files: {
                    'dist/resources/css/training.min.css': 'resources/css/training.min.css'
                }
            }
        },

        /*
         Gives statistical information about CSS compression results
         */
        compare_size: {
            files: [
                'resources/css/*.css',
                'dist/resources/css/index.min.css',
                'dist/resources/css/timeline.min.css',
                'dist/resources/css/training.min.css',
                'dist/resources/css/autumn.min.css'
            ]
        },

        /*
         This task will replace CSS and JS imports in the main html file to point to the optimized versions instead
         of linking into 'components'
         */
        processhtml: {
            index: {
                options: {
                    data: {
                        minifiedCss: '<link href="resources/css/index.min.css" type="text/css" rel="stylesheet"/>'
                    }
                },
                files: {
                    'dist/index.html': ['./index.html']
                }
            },
            press: {
                options: {
                    data: {
                        minifiedCss: '<link href="resources/css/app.min.css" type="text/css" rel="stylesheet"/>'
                    }
                },
                files: {
                    'dist/press.html': ['./press.html']
                }
            },
            timeline: {
                options: {
                    data: {
                        minifiedCss: '<link href="resources/css/timeline.min.css" type="text/css" rel="stylesheet"/>'
                    }
                },
                files: {
                    'dist/timetunnel.html': ['./timetunnel.html']
                }
            },
            training: {
                options: {
                    data: {
                        minifiedCss: '<link href="resources/css/training.min.css" type="text/css" rel="stylesheet"/>'
                    }
                },
                files: {
                    'dist/training.html': ['./training.html']
                }
            },
            autumn: {
                options: {
                    data: {
                        minifiedCss: '<link href="resources/css/index.min.css" type="text/css" rel="stylesheet"/>'
                    }
                },
                files: {
                    'dist/autumn.html': ['./autumn.html']
                }
            }
        },

        /*
         this task builds the actual .xar apps for deployment into eXistdb. zip:xar will create an unoptimized version while
         zip:production will use the optimized app found in the 'dist' directory.

         Note: here component files are cherry-picked - including the whole distribution is certainly more generic but bloats the resulting .xar too much
         */
        zip: {
            xar: {
                src: [
                    'collection.xconf',
                    '*.xml',
                    '*.xql',
                    '*.html',
                    'doc/**',
                    'modules/**',
                    'resources/**',
                    'templates/**',
                    'components/animate.css/*',
                    'components/bootstrap/dist/**',
                    'components/font-awesome/css/**',
                    'components/font-awesome/fonts/**',
                    'components/jquery/dist/**',
                    'components/snap.svg/dist/**',
                    'components/modernizr/modernizr.js'
                ],
                dest: 'build/<%=xar.name%>-<%=xar.version%>.zip'
            },
            production: {
                cwd: 'dist/',
                src: ['dist/**'],
                dest: 'build/<%=xar.name%>-<%=xar.version%>.min.zip'
            }
        },

        /*
         watches gruntfile itself and checks for problems
         */
        watch: {
            files: ['gruntfile.js'],
            tasks: ['jshint']
        }



    });

    /*
     */
    grunt.registerTask('default', [
        'replace',
        'less:development',
        'zip:xar'
    ]);

    /*
    took out imagemim as it's slowing down the task dramatically and is not always reliable.
    Better to run it manually when need images are added and to add the optimized ones to resources/img
    afterwards.
    */
    grunt.registerTask('dist', [
        'clean',
        'replace',
        'copy',
        'uglify',
        'less:production',
        'less:timeline',
        'less:training',
        'concat',
        'uncss',
        'cssmin',
        'compare_size',
        'processhtml',
        'zip:production'
    ]);


};
