(function(angular, undefined) {
    'use strict';

    var _DEPENDENCIES = ['ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.bootstrap', 'ui.router'];

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

    ResultsController.$inject = ['$scope', '$state', '$timeout','$stateParams','$window'];
    function ResultsController($scope, $state, $timeout, $stateParams, $window) {
        var vm = this;

        $scope.myData = [
            { price: 'S$713', carrier: 'MAS', aircraft: '777', duration: '8', stops: 'direct', departure: '23 June 2014 8am', arrival: '23 June 2014 10pm'},
            { price: 'S$800', carrier: 'SIA', aircraft: '777',  duration: '7', stops: 'direct', departure: '23 June 2014 8am', arrival: '23 June 2014 10pm'},
            { price: 'S$500', carrier: 'AA', aircraft: '777', duration: '15', stops: '1', departure: '23 June 2014 8am', arrival: '23 June 2014 10pm'},
            { price: 'S$450', carrier: 'MAS', aircraft: '777', duration: '15', stops: '1', departure: '23 June 2014 8am', arrival: '23 June 2014 10pm'},
            { price: 'S$666', carrier: 'SIA', aircraft: '777', duration: '12', stops: '1', departure: '23 June 2014 8am', arrival: '23 June 2014 10pm'},
            { price: 'S$878', carrier: 'SIA', aircraft: '747', duration: '23', stops: '3', departure: '23 June 2014 8am', arrival: '23 June 2014 10pm'},
            { price: 'S$1020', carrier: 'AA', aircraft: '747', duration: '23', stops: '3', departure: '23 June 2014 8am', arrival: '23 June 2014 10pm'},
            { price: 'S$500', carrier: 'MAS', aircraft: '747', duration: '23', stops: '3', departure: '23 June 2014 8am', arrival: '23 June 2014 10pm'},
            { price: 'S$420', carrier: 'ANA', aircraft: '747', duration: '23', stops: '3', departure: '23 June 2014 8am', arrival: '23 June 2014 10pm'}
        ];

        vm.gridOptions = {
            data: 'myData',
            columnDefs: [
                {field:'price', displayName: 'Price'},
                {field:'carrier', displayName:'Carrier'},
                {field:'aircraft', displayName:'Aircraft'},
                {field:'duration', displayName:'Duration'},
                {field:'stops', displayName:'Stops'},
                {field:'departure', displayName:'Departure'},
                {field:'arrival', displayName:'Arrival'}
            ],
            rowHeight: 38,
            headerRowHeight: 40,
            multiSelect: false
        };
    }
})(angular);
