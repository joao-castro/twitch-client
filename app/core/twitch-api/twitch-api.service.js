angular.module('core.twitchAPI')
	.factory('twitchAPI', ['$http',
		function($http) {
			var clientId = 'hxl1s5nxi5pgbkkdf71eh94ajq7gj9';
			var clientSecret = '9806iwgxixi0vya86aem7eha0zqmv4';
			var accessToken;
			var oauthUrl = 'https://id.twitch.tv/oauth2/';
			var helixUrl = 'https://api.twitch.tv/helix/';			
			var headers = { 'Client-ID': clientId };

			return {
				getToken: getToken,
				revokeToken: revokeToken,
				getStreamByChannelName: getStreamByChannelName,
				getStreams: getStreams,
				getStreamsAfter: getStreamsAfter,
				getGames: getGames,
				getGameByName: getGameByName
			}

			function getToken() {
				return $http.post(oauthUrl + 'token?client_id=' + clientId + '&client_secret=' + clientSecret + '&grant_type=client_credentials')
					.then(function(response) {
						accessToken = response.data.access_token;						
						headers.Authorization = 'Bearer ' + accessToken;

						return response;
					});
			}

			function revokeToken() {
				return $http.post(oauthUrl + 'revoke?client_id=' + clientId + '&token=' + accessToken)
					.then(function(response) {
						return response;
					});				
			}

			function getStreamByChannelName(channelName) {
				return $http.get(helixUrl + 'streams?user_login=' + channelName, { headers: headers })
					.then(function(response) {
						return response;
					});
			}

			function getStreams(gameId) {
				var gameIdStr = gameId ? '&game_id=' + gameId : '';

				return $http.get(helixUrl + 'streams?first=100' + gameIdStr, { headers: headers })
					.then(function(response) {
						return response;
					});				
			}

			function getStreamsAfter(paginationCursor) {
				return $http.get(helixUrl + 'streams?first=100&after=' + paginationCursor, { headers: headers })
					.then(function(response) {
						return response;
					});
			}			

			function getGames(gameIds) {
				return $http.get(helixUrl + 'games?id=' + gameIds.join('&id='), { headers: headers })
					.then(function(response) {
						return response;
					});
			}

			function getGameByName(gameName) {
				return $http.get(helixUrl + 'games?name=' + gameName, { headers: headers })
					.then(function(response) {
						return response;
					});
			}			
		}
	]);