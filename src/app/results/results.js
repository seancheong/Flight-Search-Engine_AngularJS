(function(angular, undefined) {
    'use strict';

    var _DEPENDENCIES = ['ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.bootstrap', 'ui.router', 'FlightSearch-project'];

    angular.module('FlightSearch.results', _DEPENDENCIES)
        .config(configure)
        .run(function run () {
        })
        .controller('ResultsController', ResultsController);

    configure.$inject = ['$stateProvider'];
    function configure($stateProvider) {
        $stateProvider.state("results", {
            url: '/results',
            controller: ResultsController,
            controllerAs: "vm",
            templateUrl: 'results/results.tpl.html',
            data:{ pageTitle: 'Results' }
        });
    }

    ResultsController.$inject = ['$scope', '$state', '$timeout','$stateParams','$window', 'flightSearchProjectService'];
    function ResultsController($scope, $state, $timeout, $stateParams, $window, flightSearchProjectService) {
        var vm = this;

        $scope.myData = flightSearchProjectService.getFlightResult();

        vm.gridOptions = {
            data: 'myData',
            columnDefs: [
                {field:'price', displayName: 'Price'},
                {field:'carrier', displayName:'Carrier'},
                {field:'stops', displayName:'Stops'},
                {field:'departure', displayName:'Departure'},
                {field:'arrival', displayName:'Arrival'}
            ],
            rowHeight: 38,
            headerRowHeight: 40,
            multiSelect: false
        };

        $scope.$on('resultsLoaded', function(event, result) {
            if (result === "successful")
            {
                $scope.myData = flightSearchProjectService.getFlightResult();
                $scope.$apply();
            }
        });
    }
})(angular);
