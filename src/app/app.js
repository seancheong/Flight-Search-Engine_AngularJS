(function(angular, $, document) {
  'use strict';

var _MAIN_DEPENDENCIES = ['templates-app',
                          'templates-common',
                          'FlightSearch.search',
                          'FlightSearch.results',
                          'ui.router',
                          'FlightSearch-data',
                          'angular-growl'];

var _FLIGHTSEARCH_PROJECT_DEPENDENCIES = ['angularSpinner', 'angular-growl'];
var flightURL = "https://www.googleapis.com/qpxExpress/v1/trips/search";      

/**
 * This is the main project module
 */
angular.module('FlightSearch', _MAIN_DEPENDENCIES)
       .config(appConfig)
       .run(function() {
       })
       .controller('AppCtrl', AppCtrl);

appConfig.$inject = ['$urlRouterProvider', '$locationProvider', '$stateProvider', 'growlProvider'];
function appConfig($urlRouterProvider, $locationProvider, $stateProvider, growlProvider) {
  $urlRouterProvider
    .otherwise('/search');

  growlProvider.onlyUniqueMessages(true);
  growlProvider.globalDisableCountDown(true);
  growlProvider.globalPosition('bottom-center');
  // growlProvider.globalTimeToLive(8000);
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

flightSearchProjectService.$inject = ['$timeout', '$q', '$location', 'iataDataService', 'usSpinnerService', 'growl', '$http'];
function flightSearchProjectService($timeout, $q, $location, iataDataService, usSpinnerService, growl, $http) {

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

  function searchFlight(from, to, adult, departDate, returnDate, $scope) {
    searchFlightQuery(from, to, adult, departDate, returnDate).then(function(response) {
      var responseObject = response.data;
      var tripOptions = responseObject["trips"]["tripOption"];
      flightResults = [];

      if(tripOptions !== undefined) {
       for(var tripIndex = 0; tripIndex < tripOptions.length; tripIndex++) {
          var results = {};
          var slices = tripOptions[tripIndex]["slice"];
          var departSegments = slices[0]["segment"];

          results["carrier"] = [];
          results["totalPrice"] = tripOptions[tripIndex]["saleTotal"];
          results["pricePerson"] = tripOptions[tripIndex]["pricing"][0]["saleTotal"];
          results["departDuration"] = slices[0]["duration"];
          getSegmentDetails(results, departSegments, false);

          if(returnDate !== "") {
            var returnSegments = slices[1]["segment"];
            results["returnDuration"] = slices[1]["duration"];
            getSegmentDetails(results, returnSegments, true);
          }
          
          flightResults.push(results);
        }
        console.log(flightResults);
        $scope.$broadcast('resultsLoaded',"successful");

        // navigate to results page after gotten the results.
        $timeout(function() {
          $location.path("/results");
        }, 0); 
      }
      else {
        growl.error("No trips can't be found, please make sure that you have entered a valid city name");
      }
      usSpinnerService.stop('spinner-1');
    });
  }

  function getSegmentDetails(results, segments, isReturnSegment) {
    var details = {};
    details["segments"] = [];

    for(var segmentIndex = 0; segmentIndex < segments.length; segmentIndex++) {
      var segment = {};
      var carrier = getAirlineIataCode(segments[segmentIndex]["flight"]["carrier"]);

      if((segmentIndex === 0 || results["carrier"].indexOf(carrier) === -1) && !isReturnSegment) {
        results["carrier"].push(carrier);
      }
      segment["carrier"] = carrier;
      segment["cabin"] = segments[segmentIndex]["cabin"];
      segment["aircraft"] = segments[segmentIndex]["leg"][0]["aircraft"];
      segment["arrivalTime"] = segments[segmentIndex]["leg"][0]["arrivalTime"];
      segment["departureTime"] = segments[segmentIndex]["leg"][0]["departureTime"];
      segment["origin"] = segments[segmentIndex]["leg"][0]["origin"];
      segment["destination"] = segments[segmentIndex]["leg"][0]["destination"];
      segment["mileage"] = segments[segmentIndex]["leg"][0]["mileage"];
      segment["meal"] = segments[segmentIndex]["leg"][0]["meal"];
      details["segments"].push(segment);

      if(segmentIndex === 0) {
        details["departure"] = segments[0]["leg"][0]["departureTime"];
      }

      if(segmentIndex === segments.length - 1) {
        details["stops"] = segmentIndex;
        details["arrival"] = segments[segmentIndex]["leg"][0]["arrivalTime"];
      }
    }

    if(!isReturnSegment) {
      results["depart"] = details;
    }
    else {
      results["return"] = details;
    }
  }

  function searchFlightQuery(from, to, adult, departDate, returnDate) {
    console.log("searchFlightQuery");

    usSpinnerService.spin('spinner-1');

    var securityKey = "?key=AIzaSyAhaPZOJYLVcrq8S0BVm-2PAhOqRu2AoPs";
    var downloadURL = flightURL + securityKey;
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
    flightDetails["request"]["solutions"] = "500";

    if(returnDate !== "") {
      slice = {};
      slice["origin"] = to;
      slice["destination"] = from;
      slice["date"] = returnDate;
      flightDetails["request"]["slice"].push(slice);
    }

    var flightData = JSON.stringify(flightDetails);
    console.log(flightData);

    return $http.post(downloadURL, flightData).then(handleSuccess, handleError);
  }

  function handleSuccess( response ) {
    return( response );
  }

  function handleError( response ) {
    console.log('getting response failed...');
    console.log(JSON.stringify(response));
    usSpinnerService.stop('spinner-1');
    growl.error("No trips can't be found, please make sure that you have entered a valid city name!");
    return null;
  }

}

})(angular, jQuery, document);