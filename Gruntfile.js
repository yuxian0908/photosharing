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
        template: ['template/**/**/**/*.js','template/**/**/*.js','template/**/*.js'],
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
        all: ['public/script.js','public/script.min.js',
                'public/angular.js','public/**/**/*.html',
                'public/chat/views/js/chat.min.js','public/chat/views/js/chat.js'],
        js: ['public/script.js','public/angular.js','public/chat/views/js/chat.js'],        
    },
    copy: {
        main: {
            expand: true,
            cwd: 'template',
            src: '**/**/*.html',
            dest: 'public/',
        },
        jQuery: {
            expand: true,
            cwd: 'template',
            src: '**/views/js/*.js',
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
        script: {
            src: ['template/**/*.client.module.js','template/**/services/*','template/**/config/*','template/**/controllers/*'],
            dest: 'public/script.js',
        },
    },
    uglify: {
        my_target: {
            files: {
                'public/script.min.js': ['public/script.js'],
                'public/angular.min.js': ['public/angular.js'],
                'public/chat/views/js/chat.min.js': ['public/chat/views/js/chat.js'],
            }
        }
    },
    watch: {
        scripts: {
            files: ['Gruntfile.js', 'app/**/*.js', 'config/*.js', 'config/**/*.js', 
                    'template/**/**/*.js', 'template/**/*.js', 'app.js'],
            tasks: ['jshint','clean:all','copy','concat','uglify','clean:js'],
            options: {
                livereload: true,
            },
        },
        view: {
            files: ['app/**/*.jade', 'template/**/**/*.html'],
            tasks: ['jshint','clean:all','copy','concat','uglify','clean:js'],
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