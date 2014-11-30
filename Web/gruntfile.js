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
            }
        },
        watch: {
            browserify: {
                files: ['app.jsx', './js/**'],
                tasks: ['browserify']
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['watch']);
};
