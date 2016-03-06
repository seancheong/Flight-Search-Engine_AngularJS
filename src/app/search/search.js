(function(angular, undefined) {
  'use strict';

  var _DEPENDENCIES = ['ui.router', 
                       'ui.bootstrap', 
                       'FlightSearch-project', 
                       'FlightSearch-data',
                       'ngAutocomplete'];

  angular.module('FlightSearch.search', _DEPENDENCIES)
         .config(configure)
         .directive('datepicker', datepicker)
         .controller('SearchController', SearchController);

  datepicker.$inject = ['$compile']; 
  function datepicker($compile) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModelCtrl) {
        $(function() {
          $('#departDate').datetimepicker({
            dateFormat: 'yyyy/mm/dd',
            onSelect: function(date) {
              ngModelCtrl.$setViewValue(date);
              scope.$apply();
            }
          });
        });
      }
    };
  }

  configure.$inject = ['$stateProvider'];
  function configure($stateProvider) {
    $stateProvider.state("search", {
      url: '/search',
      controller: SearchController,
      controllerAs: "vm",
      templateUrl: 'search/search.tpl.html',
      data:{ pageTitle: 'Search' }
    });
  }

  SearchController.$inject = ['$scope', '$state', '$timeout','$stateParams','$window', 'flightSearchProjectService', 'iataDataService'];
  function SearchController($scope, $state, $timeout,$stateParams,$window, flightSearchProjectService, iataDataService) {
    var vm = this;

    vm.from = "";
    vm.to = "";
    vm.adult = 1;
    vm.departDate = "";
    vm.returnDate = "";

    // google map api
    vm.acOptions = {
      types: '(cities)'
    };
    vm.acToDetails = {};
    vm.acFromDetails = {};

    vm.search = search;

    $('#departDate').datetimepicker({
      format : "YYYY-MM-DD"
    });

    $("#departDate").on("dp.change", function() {
      vm.departDate = $("#departDate").val();
    });

    function search() {
      var from = getIataCode(vm.acFromDetails.address_components["0"].short_name);
      var to = getIataCode(vm.acToDetails.address_components["0"].short_name);
      
      flightSearchProjectService.searchFlight(from, to, vm.adult, vm.departDate, vm.returnDate, $scope);
    }

    function getIataCode(city) {
      var airport = iataDataService.getAirportIATA();

      for(var dataIndex = 0; dataIndex < airport.length; dataIndex++) {
        if(city.toLowerCase() === airport[dataIndex].name.toLowerCase()) {
          return airport[dataIndex].code;
        }
      }

      return "undefined";
    }
  }

})(angular);