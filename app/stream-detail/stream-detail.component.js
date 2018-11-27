'user strict';

angular.module('streamDetail')
	.component('streamDetail', {
		templateUrl: 'stream-detail/stream-detail.template.html',
		controller: ['$routeParams',
			function StreamDetailController($routeParams) {
				this.streamUrl = 'https://player.twitch.tv/?channel=' + $routeParams.streamId;
			}
		]
	});