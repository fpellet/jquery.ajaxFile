module.exports = function(config) {
	config.set({
		basePath: '',
		frameworks: ['mocha', 'chai', 'source-map-support'],
		files: ['libs/*.js', 'tests/merge.js'],
		reporters: ['progress'],
		autoWatch: true,
		browsers: ['PhantomJS'],
        
		preprocessors: {
		    'dist/*.js': ['sourcemap']
		}
	});
};