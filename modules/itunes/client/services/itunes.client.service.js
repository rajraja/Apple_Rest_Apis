'use strict';

//Itunes service used for communicating with the itunes REST endpoints
angular.module('itunes').factory('Itunes', ['$resource',
	function($resource) {
		return $resource('itunes/:ituneId', {
			ituneId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			searchItunes: {
				url: 'https://itunes.apple.com/search',
				method: 'GET',
				isArray: false
			}
		});
	}
]);
