module.exports = function(config) {
	config.set({
		basePath: '',
		frameworks: ['mocha', 'chai'],
		files: ['node_modules/jquery/dist/jquery.js', 'tests/merge.js'],
		reporters: ['progress'],
		autoWatch: true,
		browsers: ['PhantomJS'],
        
		preprocessors: {
		    'tests/*.js': ['sourcemap']
		}
	});
};