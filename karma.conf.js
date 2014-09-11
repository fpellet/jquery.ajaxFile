module.exports = function(config) {
	config.set({
		basePath: '',
		frameworks: ['mocha', 'chai'],
		files: ['src/**/*.js', 'tests/**/*.js', 'libs/*.js'],
		reporters: ['progress'],
		autoWatch: true,
		browsers: ['PhantomJS'],

		plugins: [
			'karma-mocha',
			'karma-chai',
			'karma-phantomjs-launcher'
		]
	});
};