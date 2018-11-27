'use strict';

angular.module('core')
	.filter('imgSize', function() {
		return function(url) {
			return url.replace('{width}x{height}', '400x225');
		};
	});