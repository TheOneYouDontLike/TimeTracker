'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['./tests/*.spec.js']
            }
        },
        watch: {
            tests: {
                files: ['**/**.js'],
                tasks: ['mochaTest']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.registerTask('default', ['watch']);
};