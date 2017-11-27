module.exports = function(grunt) {
// Project configuration.
grunt.initConfig({
    concurrent: {
		default: {
			tasks: ['watch','nodemon'],
			options: {
				logConcurrentOutput: true
			}
		}
    },
    nodemon: {
        dev: {
          script: './bin/www.js'
        }
    },
    jshint: {
        app: ['Gruntfile.js', 'app/**/*.js', 'config/*.js', 'config/**/*.js'],
        template: ['template/**/**/*.js','template/**/*.js'],
        options: {
            //这里是覆盖JSHint默认配置的选项
            globals: {
                jQuery: true,
                console: true,
                module: true,
                document: true
            }
        },
    },
    clean: {
        all: ['public/users.js','public/users.min.js','public/angular.js','public/**/**/*.html'],
        js: ['public/users.js','public/angular.js'],        
    },
    copy: {
        main: {
            expand: true,
            cwd: 'template',
            src: '**/**/*.html',
            dest: 'public/',
        },
    },
    concat: {
        options: {
            separator: ';',
        },
        angular:{
            src: ['lib/angular/angular.js','lib/angular-route/angular-route.js',
                    'lib/angular-resource/angular-resource.js','template/application.js',
                    'lib/ng-file-upload/ng-file-upload-shim.min.js','lib/ng-file-upload/ng-file-upload.min.js'],
            dest: 'public/angular.js',
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
                'public/angular.min.js': ['public/angular.js'],
            }
        }
    },
    watch: {
        scripts: {
            files: ['Gruntfile.js', 'app/**/*.js', 'config/*.js', 'config/**/*.js', 
                    'template/**/**/*.js', 'template/**/*.js'],
            tasks: ['jshint','clean:all','copy','concat','uglify','clean:js'],
            options: {
                livereload: true,
            },
        },
        view: {
            files: ['app/**/*.jade', 'template/**/**/*.html'],
            options: {
                livereload: true,
            },
        },
    },
  });
  
  // Load the plugin that provides the tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-nodemon');
  grunt.loadNpmTasks('grunt-contrib-copy');
  
  // Default task(s).
  grunt.registerTask('default', ['jshint','clean:all','copy','concat','uglify','clean:js','concurrent:default']);
  
  };