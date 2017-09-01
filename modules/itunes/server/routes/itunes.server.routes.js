'use strict';

/**
 * Module dependencies.
 */
var
	itunes = require('../controllers/itunes.server.controller');
	var itunesPolicy = require('../policies/itunes.server.policy');

module.exports = function(app) {
	// Itune Routes
	app.route('/itunes').all(itunesPolicy.isAllowed)
		.get(itunes.list)
		.post( itunes.create);

	app.route('/itunes/:ituneId').all(itunesPolicy.isAllowed)
		.get(itunes.read)
		.put( itunes.hasAuthorization, itunes.update)
		.delete( itunes.hasAuthorization, itunes.delete);

	// Finish by binding the itune middleware
	app.param('ituneId', itunes.ituneByID);
};
