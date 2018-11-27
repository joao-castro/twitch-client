'use strict';

angular.module('twitchApp')
	.config(['$routeProvider', '$sceDelegateProvider',
		function config($routeProvider, $sceDelegateProvider) {
			$routeProvider
				.when('/streams', {
					template: '<stream-list></stream-list>'
				})
				.when('/streams/:streamId', {
					template: '<stream-detail></stream-detail>'
				})
				.otherwise('/streams');

			$sceDelegateProvider.resourceUrlWhitelist([
				'self', 
				'https://player.twitch.tv/**'
			]);
		}
	]);