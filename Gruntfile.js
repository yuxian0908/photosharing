module.exports = function(grunt) {
// Project configuration.
grunt.initConfig({
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['public/users/users.client.module.js','public/users/services/*','public/users/config/*','public/users/controllers/*'],
        dest: 'public/users.js',
      },
    },
  });
  
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  
  // Default task(s).
  grunt.registerTask('default', ['concat']);
  
  };