'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            options: {
                debug: true,
                transform: ['reactify'],
                extensions: ['.jsx'],
            },
            dev: {
                src: ['app.jsx', 'js/*.jsx'],
                dest: 'bundle.js'
            },
            tests: {
                src: ['tests/**/*.jsx'],
                dest: 'tests/testsBundle.js'
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['tests/**/*.js']
            }
        },
        watch: {
            browserify: {
                files: ['app.jsx', './js/**', 'tests/**/*.jsx'],
                tasks: ['browserify:dev', 'browserify:tests', 'mochaTest']
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.registerTask('default', ['watch']);
};
