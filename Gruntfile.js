module.exports = function(grunt) {
// Project configuration.
grunt.initConfig({
    clean: {
        js: ['public/users.js','public/users.min.js']
    },
    concat: {
        options: {
            separator: ';',
        },
        dist: {
            src: ['template/users/users.client.module.js','template/users/services/*','template/users/config/*','template/users/controllers/*'],
            dest: 'public/users.js',
        },
    },
    uglify: {
        my_target: {
            files: {
                'public/users.min.js': ['public/users.js']
            }
        }
    }
  });
  
  // Load the plugin that provides the tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  // Default task(s).
  grunt.registerTask('default', ['clean','concat','uglify']);
  
  };