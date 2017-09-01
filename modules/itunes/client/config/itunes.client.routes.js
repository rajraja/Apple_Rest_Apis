'use strict';

// Setting up route
angular.module('itunes').config(['$stateProvider',
	function($stateProvider) {
		// Itunes state routing
		$stateProvider.
		state('list', {
			url: '/list',
			templateUrl: 'modules/itunes/client/views/list-itunes.client.view.html',
			data: {
				roles: ['user', 'admin']
			}
		});
	}
]);
