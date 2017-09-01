'use strict';

// Configuring the Itunes module
angular.module('itunes').run(['menuService',
	function(menuService) {
		// Set top bar menu items
		menuService.addMenuItem('topbar', {
			title: 'List',
			state: 'list',
			roles: ['user', 'admin']
		});

	}
]);
