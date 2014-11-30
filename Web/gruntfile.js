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
        }
    });


    grunt.loadNpmTasks('grunt-browserify');
    grunt.registerTask('default', ['browserify']);
};
