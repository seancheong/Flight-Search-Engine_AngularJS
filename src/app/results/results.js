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
        .controller('ResultsController', ResultsController)
        .controller('ModalController', ModalController);

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

    ResultsController.$inject = ['$scope', '$state', '$timeout','$stateParams','$window', 'flightSearchProjectService', '$modal'];
    function ResultsController($scope, $state, $timeout, $stateParams, $window, flightSearchProjectService, $modal) {
        var vm = this;
        vm.convertTime = convertTime;
        vm.convertMinToHr = convertMinToHr;
        vm.isReturnFlight = isReturnFlight;
        vm.details = details;

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

        function details(flightDetail) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'results/results-details.tpl.html',
                controller: 'ModalController',
                controllerAs: 'vm',
                size: 'lg',
                scope: $scope,
                keyboard: false,
                backdrop: 'static',
                resolve: {
                  flightDetail: function() {
                    return flightDetail;
                  }
                }
            });
        }

        $scope.$on('resultsLoaded', function(event, result) {
            if (result === "successful")
            {
                $scope.myData = flightSearchProjectService.getFlightResult();
                $scope.$apply();
            }
        });
    }

    ModalController.$inject = ['$scope', '$modalInstance', 'flightDetail'];
    function ModalController($scope, $modalInstance, flightDetail) {
        $scope.convertTime = convertTime;
        $scope.isReturnFlight = isReturnFlight;
        $scope.ok = ok;
        $scope.departSegments = flightDetail.depart.segments;
        if(flightDetail["return"] !== undefined) {
            $scope.returnSegments = flightDetail["return"].segments;
        }

        function convertTime(time) {
            var convertedTime = moment(time);
            return convertedTime.format('dddd') + ", " + convertedTime.format('DD-MMM') + " " + convertedTime.format('hh:mm a');
        }

        function isReturnFlight() {
            if($scope.returnSegments !== undefined) {
                return true;
            }
            else {
                return false;
            }
        }

        function ok() {
            $modalInstance.close();
        }
    }
})(angular);
