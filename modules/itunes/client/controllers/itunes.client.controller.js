'use strict';

angular.module('itunes').controller('ItunesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Itunes',
	function($scope, $stateParams, $location, Authentication, Itunes) {
		$scope.authentication = Authentication;
		$scope.search = function() {
			var req ={
				'term':'all',
			}
			Itunes.searchItunes(req,function(response) {
				$scope.itunes =response.results;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		$scope.filter = function(searchText) {
			if(!searchText){
				searchText = 'all';
			}
			var req ={
				'term':searchText,
			}

			Itunes.searchItunes(req,function(response) {
				$scope.itunes =response.results;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);
