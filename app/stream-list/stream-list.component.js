'use strict';

angular.module('streamList')
	.component('streamList', {
		templateUrl: 'stream-list/stream-list.template.html',
		controller: ['$http', '$interval', 'localStorageService', 'fetchedGames', 'fetchedStreams', 'twitchAPI',
			function StreamListController($http, $interval, localStorageService, fetchedGames, fetchedStreams, twitchAPI) {
				var ctrl = this;

				ctrl.searchType = "Anything";
				ctrl.searchValue = localStorageService.isSupported && localStorageService.get('searchValue') ? localStorageService.get('searchValue') : '';
				ctrl.maxResults = localStorageService.isSupported && localStorageService.get('maxResults') ? localStorageService.get('maxResults') : 100;
				ctrl.fetchStreams = fetchStreams;
				ctrl.saveMaxResults = saveMaxResults;
				ctrl.filterStreams = filterStreams;

				fetchedStreams.getStreams().length ? ctrl.filterStreams() : ctrl.fetchStreams();

				$interval(fetchStreams, 60000);

				var streams;
				var paginationCursor;
				var extraFetches;

				function fetchStreams() {
					if (ctrl.searchType === 'Anything') {
						extraFetches = 9;

						twitchAPI.getToken().then(function(response) {
							twitchAPI.getStreams().then(function(response) {
								fetchGames(response, 1);
							});
						});
					}
					else {
						twitchAPI.getToken().then(function(response) {
							twitchAPI.getStreamByChannelName(ctrl.searchValue).then(function(response) {
								var stream = response.data.data[0];

								twitchAPI.getGames([stream.game_id]).then(function(response) {
									var game = response.data.data[0];

									stream.title = stream.title ? stream.title : '-';
									stream.user_name = stream.user_name ? stream.user_name : '-';
									stream.game_name = game.name ? game.name : '-';									
								});

								fetchedStreams.setStreams([stream]);
								ctrl.filterStreams();

								twitchAPI.revokeToken();														
							});
						});
					}
				}

				function fetchGames(response, firstStreamFetch) {
					streams = response.data.data;
					paginationCursor = response.data.pagination.cursor;

					var gameIds = streams
						.map(function(currentValue) {
							return currentValue.game_id;
						})
						.filter(function(element, index, array) {
							return array.indexOf(element) == index && element && element !== '0' && !fetchedGames.getGame(element);
						})

					if (gameIds.length) {
						twitchAPI.getGames(gameIds).then(function(response) {
							response.data.data.forEach(function(currentValue) {
								fetchedGames.setGame(currentValue.id, currentValue.name);
							});				

							fetchNextStreams(firstStreamFetch);
						});
					}
					else {
						fetchNextStreams(firstStreamFetch);
					}
				}

				function fetchNextStreams(firstStreamFetch) {
					streams.forEach(function(currentValue) {
						currentValue.title = currentValue.title ? currentValue.title : '-';
						currentValue.user_name = currentValue.user_name ? currentValue.user_name : '-';
						currentValue.game_name = fetchedGames.getGame(currentValue.game_id) ? fetchedGames.getGame(currentValue.game_id) : '-';
					});	

					firstStreamFetch ? fetchedStreams.setStreams(streams) : fetchedStreams.setStreams(fetchedStreams.getStreams().concat(streams));
					ctrl.filterStreams();

					if (extraFetches-- > 0) {
						twitchAPI.getStreamsAfter(paginationCursor).then(function(response) {
							fetchGames(response);
						});
					}
					else {
						twitchAPI.revokeToken();		
					}
				}

				function saveMaxResults() {
					if (localStorageService.isSupported) {
						localStorageService.set('maxResults', ctrl.maxResults);
					}					
				}

				function filterStreams() {
					if (localStorageService.isSupported) {
						localStorageService.set('searchValue', ctrl.searchValue);
					}

					if (ctrl.searchValue) {
						ctrl.filteredStreams = fetchedStreams.getStreams().filter(function(element) {
							return (element.title.toLowerCase().indexOf(ctrl.searchValue.toLowerCase()) != -1 
								|| element.user_name.toLowerCase().indexOf(ctrl.searchValue.toLowerCase()) != -1 
								|| element.game_name.toLowerCase().indexOf(ctrl.searchValue.toLowerCase()) != -1);
						});
					}
					else {
						ctrl.filteredStreams = fetchedStreams.getStreams();
					}
				}				
			}
		]	
	});