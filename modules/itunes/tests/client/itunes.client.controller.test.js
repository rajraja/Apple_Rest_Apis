'use strict';

(function() {
	// Itunes Controller Spec
	describe('ItunesController', function() {
		// Initialize global variables
		var ItunesController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Itunes controller.
			ItunesController = $controller('ItunesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one itune object fetched from XHR', inject(function(Itunes) {
			// Create sample itune using the Itunes service
			var sampleItune = new Itunes({
				title: 'An Itune about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample itunes array that includes the new itune
			var sampleItunes = [sampleItune];

			// Set GET response
			$httpBackend.expectGET('itunes').respond(sampleItunes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.itunes).toEqualData(sampleItunes);
		}));

		it('$scope.findOne() should create an array with one itune object fetched from XHR using a ituneId URL parameter', inject(function(Itunes) {
			// Define a sample itune object
			var sampleItune = new Itunes({
				title: 'An Itune about MEAN',
				content: 'MEAN rocks!'
			});

			// Set the URL parameter
			$stateParams.ituneId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/itunes\/([0-9a-fA-F]{24})$/).respond(sampleItune);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.itune).toEqualData(sampleItune);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Itunes) {
			// Create a sample itune object
			var sampleItunePostData = new Itunes({
				title: 'An Itune about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample itune response
			var sampleItuneResponse = new Itunes({
				_id: '525cf20451979dea2c000001',
				title: 'An Itune about MEAN',
				content: 'MEAN rocks!'
			});

			// Fixture mock form input values
			scope.title = 'An Itune about MEAN';
			scope.content = 'MEAN rocks!';

			// Set POST response
			$httpBackend.expectPOST('itunes', sampleItunePostData).respond(sampleItuneResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.title).toEqual('');
			expect(scope.content).toEqual('');

			// Test URL redirection after the itune was created
			expect($location.path()).toBe('/itunes/' + sampleItuneResponse._id);
		}));

		it('$scope.update() should update a valid itune', inject(function(Itunes) {
			// Define a sample itune put data
			var sampleItunePutData = new Itunes({
				_id: '525cf20451979dea2c000001',
				title: 'An Itune about MEAN',
				content: 'MEAN Rocks!'
			});

			// Mock itune in scope
			scope.itune = sampleItunePutData;

			// Set PUT response
			$httpBackend.expectPUT(/itunes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/itunes/' + sampleItunePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid ituneId and remove the itune from the scope', inject(function(Itunes) {
			// Create new itune object
			var sampleItune = new Itunes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new itunes array and include the itune
			scope.itunes = [sampleItune];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/itunes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleItune);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.itunes.length).toBe(0);
		}));
	});
}());