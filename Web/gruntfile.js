'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            options: {
                transform: ['reactify'],
                extensions: ['.jsx'],
                exclude: ['jsdom']
            },
            dev: {
                src: ['app.jsx'],
                dest: 'bundle.js'
            },
            tests: {
                src: ['tests/suite.jsx'],
                dest: 'spec.js'
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['spec.js']
            }
        },
        watch: {
            browserify: {
                files: ['app.jsx', './js/**'],
                tasks: ['browserify:dev', 'mochaTest']
            },
            tests: {
                files: ['tests/**/*.jsx'],
                tasks: ['browserify:tests', 'mochaTest']
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.registerTask('default', ['watch']);
};
