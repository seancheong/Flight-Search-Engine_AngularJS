(function(angular, $, document) {
  'use strict';

var _MAIN_DEPENDENCIES = ['templates-app',
                          'templates-common',
                          'FlightSearch.search',
                          'FlightSearch.results',
                          'ui.router',
                          'FlightSearch-data'];

var _FLIGHTSEARCH_PROJECT_DEPENDENCIES = ['angularSpinner'];
var getFlightURL = "https://www.googleapis.com/qpxExpress/v1/trips/search";      

/**
 * This is the main project module
 */
angular.module('FlightSearch', _MAIN_DEPENDENCIES)
       .config(appConfig)
       .run(function() {
       })
       .controller('AppCtrl', AppCtrl);

appConfig.$inject = ['$urlRouterProvider', '$locationProvider', '$stateProvider'];
function appConfig($urlRouterProvider, $locationProvider, $stateProvider) {
  $urlRouterProvider
    .otherwise('/search');
}

AppCtrl.$inject = ['$scope', '$location', '$sce', 'flightSearchProjectService'];
function AppCtrl($scope, $location, $sce, flightSearchProjectService) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if (angular.isDefined(toState.data.pageTitle)) {
      $scope.pageTitle = toState.data.pageTitle + ' | Flight-Search' ;
    }
  });
}

/**
 * service that manages application data
 */
angular.module('FlightSearch-project', _FLIGHTSEARCH_PROJECT_DEPENDENCIES)
       .factory('flightSearchProjectService', flightSearchProjectService);

flightSearchProjectService.$inject = ['$timeout', '$q', '$location', 'iataDataService', 'usSpinnerService'];
function flightSearchProjectService($timeout, $q, $location, iataDataService, usSpinnerService) {

  var flightResults = [];

  return {
    searchFlight : searchFlight,
    getFlightResult : getFlightResult
  };

  function getFlightResult() {
    return flightResults;
  }

  function getAirlineIataCode(airline) {
    var airlineIATA = iataDataService.getAirlineIATA();

    for(var airlineIndex = 0; airlineIndex < airlineIATA.length; airlineIndex++) {
      if(airlineIATA[airlineIndex]["code"] === airline) {
        return airlineIATA[airlineIndex]["name"] + " (" + airlineIATA[airlineIndex]["icao"] + ")";
      }
    }
  }

  function searchFlight(from, to, adult, departDate, $scope) {
    console.log("searchFlight");

    searchFlightQuery(from, to, adult, departDate).then(function(response) {
      var responseObject = JSON.parse(response);
      var tripOptions = responseObject["trips"]["tripOption"];
      flightResults = [];

      for(var tripIndex = 0; tripIndex < tripOptions.length; tripIndex++) {
        var results = {};
        var segments = tripOptions[tripIndex]["slice"][0]["segment"];

        results["price"] = tripOptions[tripIndex]["saleTotal"];

        for(var segmentIndex = 0; segmentIndex < segments.length; segmentIndex++) {
          results["carrier"] = getAirlineIataCode(segments[segmentIndex]["flight"]["carrier"]);

          if(segmentIndex === 0) {
            results["departure"] = segments[0]["leg"][0]["departureTime"];
          }
          results["stops"] = segmentIndex;
          results["arrival"] = segments[segmentIndex]["leg"][0]["arrivalTime"];
        }
        flightResults.push(results);
      }
      $scope.$broadcast('resultsLoaded',"successful");
      usSpinnerService.stop('spinner-1');

      // navigate to results page after gotten the results.
      $timeout(function() {
        $location.path("/results");
      }, 0);
    });
  }

  function searchFlightQuery(from, to, adult, departDate) {
    console.log("searchFlightQuery");

    usSpinnerService.spin('spinner-1');

    var securityKey = "?key=AIzaSyAhaPZOJYLVcrq8S0BVm-2PAhOqRu2AoPs";
    var downloadURL = getFlightURL + securityKey;
    var flightDetails = {};
    flightDetails["request"] = {};
    flightDetails["request"]["passengers"] = {};
    flightDetails["request"]["slice"] = [];
    var slice = {};

    flightDetails["request"]["passengers"]["adultCount"] = adult;
    slice["origin"] = from;
    slice["destination"] = to;
    slice["date"] = departDate;
    flightDetails["request"]["slice"].push(slice);
    flightDetails["request"]["solutions"] = 50;
    var flightData = JSON.stringify(flightDetails);
    console.log(flightData);

    var request = $.ajax({
        url: downloadURL,
        type: "POST",
        data : flightData,
        dataType: "text",
        contentType: "application/json"
      });

    return request.then(handleSuccess, handleError);
  }

  function handleSuccess( response ) {
    return( response );
  }

  function handleError( response ) {
    console.log('getting response failed...');
    console.log(JSON.stringify(response));
    return null;
  }

}

})(angular, jQuery, document);