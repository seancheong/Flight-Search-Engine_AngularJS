(function(angular, undefined) {
  'use strict';

  var _DEPENDENCIES = ['ui.router', 'ui.bootstrap', 'FlightSearch-project'];

  angular.module('FlightSearch.search', _DEPENDENCIES)
         .config(configure);

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

  SearchController.$inject = ['$scope', '$state', '$timeout','$stateParams','$window', 'flightSearchProjectService'];
  function SearchController($scope, $state, $timeout,$stateParams,$window, flightSearchProjectService) {
    var vm = this;

    vm.search = search;

    function search() {
      flightSearchProjectService.searchFlight($scope);
    }
  }

})(angular);