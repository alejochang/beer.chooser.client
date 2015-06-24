//Alejandro Chang alejochang@gmail.com

var restUrlRoot = 'http://localhost:8888/app';

//Main module 
var mainApp = angular.module('mainApp', ['ngResource', 'luegg.directives']);

//Configure the route provider
mainApp.config(function($routeProvider) {
	$routeProvider.when('/', {
		controller : 'BeerChooserController',
        templateUrl : 'views/pickoftheday.html'
	}).when('/pickoftheday', {
		controller : 'BeerChooserController',
		templateUrl : 'views/pickoftheday.html'
	}).when('/about', {
        controller : 'BeerChooserController',
        templateUrl : 'views/about.html'
    });
});


// 
mainApp.factory('BeerChooserService', ['$rootScope', '$http', function($rootScope, $http) {
	$rootScope.baseUrl = restUrlRoot;
	return {
            getStore: function(id) {
                $http.defaults.useXDomain = true;
                $http.defaults.headers.common['Authorization'] = "Token MDowOGFiYjZhMC0xNzY1LTExZTUtYjliZi00MzAxM2YzNTVhYTk6enNXNkNmWEJXSXljTmh2cDlUVW53ZUw1TkxjR1c0bGdvZzBC"
                $http.get('https://lcboapi.com/stores/511');
            },
			getBeer: function(id) {
				return $http.get($rootScope.baseUrl + '/beer/get?id=' + id);
		    },
            getPickOfTheDay: function(id) {
                return $http.get($rootScope.baseUrl + '/beer/get/choice');
            },
		    getAnotherBeer: function(beer) {
		    	return $http({
		    	    method: 'POST',
		    	    url: $rootScope.baseUrl + '/beer/next',
		    	    data: beer,
		    	    headers: {
		    	        'Content-Type': 'application/json'
		    	    }});
		    },
		    saveBeerAsTried: function(beer){
		    	return $http({
		    	    method: 'POST',
		    	    url: $rootScope.baseUrl + '/beer/save',
		    	    data: beer,
		    	    headers: {
		    	        'Content-Type': 'application/json'
		    	    }});
		    },
            fetchPreviousChoices: function(){
                return $http.get($rootScope.baseUrl + '/beer/get');
            },
            fetchPreviousChoicesSortedByPrice: function(){
                return $http.get($rootScope.baseUrl + '/beer/get/sort/by/priceInCents/DESC');
            }
		};
}]);

mainApp.controller('BeerChooserController', ['$scope', '$location', 'BeerChooserService', function($scope, $location, BeerChooserService) {
    $scope.beer = {
        id:"",
        name:"",
        tasting_note:"",
        style:"",
        packageType:"",
        price_in_cents:"",
        producer_name:"",
        serving_suggestion:"",
        image_thumb_url:"",
        image_url:""
    };
    $scope.store = {
      name:"King & Spadina",
      address_line_1: "415 King Street West",
      city: "Toronto",
      postal_code: "M5V1K1",
      telephone: "(416) 598-1482"
    };
	$scope.isBeerAlreadyTried = function(){
		var response = BeerChooserService.getBeer($scope.beerId);				
		response.success(function(beer) {
			if(typeof beer === 'undefined'){
				$scope.tried = false;
			}else{
				$scope.tried = true;
			}	
		});
	};
    $scope.getPickOfTheDay = function(){
        var response = BeerChooserService.getPickOfTheDay();
        response.success(function(beer) {
            if(typeof beer === 'undefined'){
                $scope.beer = false;
            }else{
                $scope.beer = beer;
            }
            $scope.fetchPreviousChoices();
            $scope.fetchPreviousChoicesSortedByPrice();
        }).error(
            function() {
                $scope.fetchPreviousChoices();
                $scope.fetchPreviousChoicesSortedByPrice();
            }
        );
    };

	$scope.saveBeerAsTried = function() {
		var response = BeerChooserService.saveBeerAsTried($scope.beer);
        response.success(function(data, status, headers, config) {
            $scope.getPickOfTheDay();
        });
    };
    $scope.fetchPreviousChoices = function(){
        var response = BeerChooserService.fetchPreviousChoices();
        response.success(function(beers) {
            if(typeof beers === 'undefined'){
                $scope.previousBeers = {};
            }else{
                $scope.previousBeers = beers;
            }
        });
    };
    $scope.fetchPreviousChoicesSortedByPrice = function(){
        var response = BeerChooserService.fetchPreviousChoicesSortedByPrice();
        response.success(function(beers) {
            if(typeof beers === 'undefined'){
                $scope.previousBeersSortedByPrice = {};
            }else{
                $scope.previousBeersSortedByPrice = beers;
            }
        });
    };

    $scope.getPickOfTheDay();
}]);
