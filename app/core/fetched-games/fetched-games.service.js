angular.module('core.fetchedGames')
	.factory('fetchedGames', function() {
		var games = {};

		return {
			getGame: getGame,
			setGame: setGame
		}

		function getGame(id) {
			return games[id];
		}

		function setGame(id, name) {
			games[id] = name;
		}
	});