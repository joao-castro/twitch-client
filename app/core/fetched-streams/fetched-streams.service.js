angular.module('core.fetchedStreams')
	.factory('fetchedStreams', function() {
		var streams = [];

		return {
			getStreams: getStreams,
			setStreams: setStreams
		}

		function getStreams() {
			return streams;
		}

		function setStreams(array) {
			streams = array;
		}
	});