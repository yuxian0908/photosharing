module.exports = function(grunt) {
// Project configuration.
grunt.initConfig({
    clean: {
        all: ['public/users.js','public/users.min.js'],
        js: ['public/users.js'],        
    },
    concat: {
        options: {
            separator: ';',
        },
        users: {
            src: ['template/users/users.client.module.js','template/users/services/*','template/users/config/*','template/users/controllers/*'],
            dest: 'public/users.js',
        },
    },
    uglify: {
        my_target: {
            files: {
                'public/users.min.js': ['public/users.js'],
            }
        }
    }
  });
  
  // Load the plugin that provides the tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  // Default task(s).
  grunt.registerTask('default', ['clean:all','concat','uglify','clean:js']);
  
  };