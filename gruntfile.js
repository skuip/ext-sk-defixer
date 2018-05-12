/* global module */

module.exports = function (grunt)
{
	// load plugins
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-zip');

	grunt.initConfig(
		{
			// pkg: grunt.file.readJSON('package.json'),

			eslint:
			{
				options: { configFile: 'conf/eslint.json' },
				development: [ 'src/*.js' ]
			},

			stylus: {
				options: {
				},
				build: {
					options: {
						compress: false,
						linenos: false
					},
					files: [{
						expand: true,
						src: [ 'src/*.styl' ],
						dest: '.',
						ext: '.css'
					}]
				}
			},

			watch:
			{
				options: { atBegin: true, spawn: false },
				javascript:
				{
					files: [ 'src/*.js' ],
					tasks: [ 'eslint', 'zip' ]
				},
				stylesheet:
				{
					files: [ 'src/*.styl' ],
					tasks: [ 'stylus', 'zip' ]
				}
			},

			zip: {
				dist: {
					cwd: 'src/',
					src: [ 'src/*' ],
					dest: 'extension.zip'
				}
			}
		});

		// register at least this one task
		grunt.registerTask('default', [ 'watch' ]);
};
