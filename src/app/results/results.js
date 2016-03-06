(function(angular, undefined) {
    'use strict';

    var _DEPENDENCIES = ['ui.grid', 
                         'ui.grid.selection', 
                         'ui.grid.resizeColumns', 
                         'ui.bootstrap', 
                         'ui.router', 
                         'FlightSearch-project',
                         'angularUtils.directives.dirPagination'];

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
        vm.convertTime = convertTime;
        vm.convertMinToHr = convertMinToHr;
        vm.isReturnFlight = isReturnFlight;

        function convertTime(time) {
            var convertedTime = moment(time);
            return convertedTime.format('dddd') + ", " + convertedTime.format('DD-MMM') + " " + convertedTime.format('hh:mm a');
        }

        function convertMinToHr(min) {
            var hour = Math.floor(min / 60);
            var minute = min % 60;

            if(hour < 1) {
                return minute + "minutes";
            }
            else {
                return hour + "hours " + minute + "minutes";
            }
        }

        vm.flightData = flightSearchProjectService.getFlightResult();

        function isReturnFlight(data) {
            if(data["return"] !== undefined) {
                return true;
            }
            else {
                return false;
            }
        }

        // vm.gridOptions = {
        //     data: 'myData',
        //     columnDefs: [
        //         {field:'price', displayName: 'Price'},
        //         {field:'carrier', displayName:'Airline'},
        //         {field:'stops', displayName:'Stops'},
        //         {field:'departure', displayName:'Departure'},
        //         {field:'arrival', displayName:'Arrival'}
        //     ],
        //     rowHeight: 38,
        //     headerRowHeight: 40,
        //     multiSelect: false
        // };

        $scope.$on('resultsLoaded', function(event, result) {
            if (result === "successful")
            {
                $scope.myData = flightSearchProjectService.getFlightResult();
                $scope.$apply();
            }
        });
    }
})(angular);
