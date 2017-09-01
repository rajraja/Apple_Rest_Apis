'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
		path = require('path'),
		errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
		Itune = mongoose.model('Itune'),
		_ = require('lodash');

/**
 * Create a itune
 */
exports.create = function(req, res) {
	var itune = new Itune(req.body);
	itune.user = req.user;

	itune.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(itune);
		}
	});
};

/**
 * Show the current itune
 */
exports.read = function(req, res) {
	res.jsonp(req.itune);
};

/**
 * Update a itune
 */
exports.update = function(req, res) {
	var itune = req.itune;

	itune = _.extend(itune, req.body);

	itune.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(itune);
		}
	});
};

/**
 * Delete an itune
 */
exports.delete = function(req, res) {
	var itune = req.itune;

	itune.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(itune);
		}
	});
};

/**
 * List of Itunes
 */
exports.list = function(req, res) {
	Itune.find().sort('-created').populate('user', 'displayName').exec(function(err, itunes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(itunes);
		}
	});
};

/**
 * Itune middleware
 */
exports.ituneByID = function(req, res, next, id) {
	Itune.findById(id).populate('user', 'displayName').exec(function(err, itune) {
		if (err) return next(err);
		if (!itune) return next(new Error('Failed to load itune ' + id));
		req.itune = itune;
		next();
	});
};

/**
 * Itune authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.itune.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
