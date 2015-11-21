(function(angular, undefined) {
  'use strict';

  var _DEPENDENCIES = ['ui.router', 'ui.bootstrap'];

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

  SearchController.$inject = ['$scope', '$state', '$timeout','$stateParams','$window'];
  function SearchController($scope, $state, $timeout,$stateParams,$window) {
    var vm = this;
  }

})(angular);