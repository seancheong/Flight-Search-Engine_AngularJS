describe( 'AppCtrl', function() {
  describe( 'isCurrentUrl', function() {
    var AppCtrl, $location, $scope;

    beforeEach( module( 'FlightSearch' ) );

    beforeEach( inject( function( $controller, _$location_, $rootScope ) {
      $location = _$location_;
      $scope = $rootScope.$new();
      AppCtrl = $controller( 'AppCtrl', { $location: $location, $scope: $scope });
    }));

    it( 'should pass a dummy test', inject( function() {
      expect( AppCtrl ).toBeTruthy();
    }));
  });

  describe('test flightSearchProjectService', function() {
    beforeEach(module('FlightSearch-project'));
    beforeEach(module('FlightSearch-data'));

    var flightSearchService, iataDataService, scope, httpBackend, growl, apiKey, url;

    beforeEach(inject(function(_flightSearchProjectService_, _iataDataService_, $rootScope, $httpBackend, _growl_) {
      flightSearchService = _flightSearchProjectService_;
      iataDataService = _iataDataService_;
      scope = $rootScope.$new();
      httpBackend = $httpBackend;
      growl = _growl_;

      apiKey = iataDataService.getApiKey();
      url = "https://www.googleapis.com/qpxExpress/v1/trips/search?key=" + apiKey;
    }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it('should return the correct results when user do a searchFlight query', function() {
      var from = "SIN";
      var to = "PAR";
      var departDate = "2016-11-19";
      var returnDate = "";
      var adult = "1";
      var searchData = {
                          "request": {
                              "passengers": {
                                  "adultCount": "1"
                              },
                              "slice": [
                                  {
                                      "origin": "SIN",
                                      "destination": "PAR",
                                      "date": "2016-11-19"
                                  }
                              ],
                              "solutions": "500"
                          }
                      };

      httpBackend.expectPOST(url, searchData).respond(
        {
          "kind": "qpxExpress#tripsSearch",
          "trips": {
            "kind": "qpxexpress#tripOptions",
            "requestId": "qhfDFVdVSFewDSUNN0NtTs",
            "data": {},
            "tripOption": [
              {
                "kind": "qpxexpress#tripOption",
                "saleTotal": "SGD790.70",
                "id": "SChZxaEfih1Pz1qMZqGQ4H001",
                "slice": [
                  {
                    "kind": "qpxexpress#sliceInfo",
                    "duration": 1050,
                    "segment": [
                      {
                        "kind": "qpxexpress#segmentInfo",
                        "duration": 340,
                        "flight": {
                          "carrier": "AI",
                          "number": "381"
                        },
                        "id": "GS7hBmgkPqZGxuKX",
                        "cabin": "COACH",
                        "bookingCode": "L",
                        "bookingCodeCount": 9,
                        "marriedSegmentGroup": "0",
                        "leg": [
                          {
                            "kind": "qpxexpress#legInfo",
                            "id": "LWqQcGJdWvC+FTLw",
                            "aircraft": "788",
                            "arrivalTime": "2016-11-19T11:35+05:30",
                            "departureTime": "2016-11-19T08:25+08:00",
                            "origin": "SIN",
                            "destination": "DEL",
                            "originTerminal": "2",
                            "destinationTerminal": "3",
                            "duration": 340,
                            "mileage": 2582,
                            "meal": "Meal"
                          }
                        ],
                        "connectionDuration": 100
                      },
                      {
                        "kind": "qpxexpress#segmentInfo",
                        "duration": 610,
                        "flight": {
                          "carrier": "AI",
                          "number": "143"
                        },
                        "id": "GqGRTzysq3HBDIS+",
                        "cabin": "COACH",
                        "bookingCode": "L",
                        "bookingCodeCount": 9,
                        "marriedSegmentGroup": "1",
                        "leg": [
                          {
                            "kind": "qpxexpress#legInfo",
                            "id": "LUZm2nBFb22OeL9X",
                            "aircraft": "788",
                            "arrivalTime": "2016-11-19T18:55+01:00",
                            "departureTime": "2016-11-19T13:15+05:30",
                            "origin": "DEL",
                            "destination": "CDG",
                            "originTerminal": "3",
                            "destinationTerminal": "2C",
                            "duration": 610,
                            "mileage": 4077,
                            "meal": "Meal"
                          }
                        ]
                      }
                    ]
                  }
                ],
                "pricing": [
                  {
                    "kind": "qpxexpress#pricingInfo",
                    "fare": [
                      {
                        "kind": "qpxexpress#fareInfo",
                        "id": "AlMsSodBYFSB2fVP4pk8RkB7kXZMdA194m3J/YbK3zSo",
                        "carrier": "AI",
                        "origin": "SIN",
                        "destination": "PAR",
                        "basisCode": "LOWSG"
                      }
                    ],
                    "segmentPricing": [
                      {
                        "kind": "qpxexpress#segmentPricing",
                        "fareId": "AlMsSodBYFSB2fVP4pk8RkB7kXZMdA194m3J/YbK3zSo",
                        "segmentId": "GqGRTzysq3HBDIS+"
                      },
                      {
                        "kind": "qpxexpress#segmentPricing",
                        "fareId": "AlMsSodBYFSB2fVP4pk8RkB7kXZMdA194m3J/YbK3zSo",
                        "segmentId": "GS7hBmgkPqZGxuKX"
                      }
                    ],
                    "baseFareTotal": "SGD420.00",
                    "saleFareTotal": "SGD420.00",
                    "saleTaxTotal": "SGD370.70",
                    "saleTotal": "SGD790.70",
                    "passengers": {
                      "kind": "qpxexpress#passengerCounts",
                      "adultCount": 1
                    },
                    "fareCalculation": "SIN AI X/DEL AI PAR 298.99LOWSG NUC 298.99 END ROE 1.40469 FARE SGD 420.00 XT 8.00OO 6.10OP 19.90SG 336.70YQ",
                    "latestTicketingTime": "2016-03-31T23:59-05:00",
                    "ptc": "ADT",
                    "refundable": true
                  }
                ]
              }
            ]
          }
        });

      spyOn(scope, "$broadcast");
      flightSearchService.searchFlight(from, to, adult, departDate, returnDate, scope);
      httpBackend.flush();

      var flightResults = flightSearchService.getFlightResult();
      expect(scope.$broadcast).toHaveBeenCalledWith("resultsLoaded", "successful");
      expect(flightResults.length).toNotBe(0);
      expect(flightResults[0]["totalPrice"]).toBe("SGD790.70");
      expect(flightResults[0]["carrier"][0]).toBe("Air India (AIC)");
      expect(flightResults[0]["depart"]["departure"]).toBe("2016-11-19T08:25+08:00");
      expect(flightResults[0]["depart"]["arrival"]).toBe("2016-11-19T18:55+01:00");
      expect(flightResults[0]["depart"]["stops"]).toBe(1);
    });

    it('should return error message if the flight cannot be found', function() {
      var from = "SIN";
      var invalidTo = "PEX";
      var departDate = "2016-11-19";
      var returnDate = "";
      var adult = "1";
      var searchData = {
                          "request": {
                              "passengers": {
                                  "adultCount": "1"
                              },
                              "slice": [
                                  {
                                      "origin": "SIN",
                                      "destination": "PEX",
                                      "date": "2016-11-19"
                                  }
                              ],
                              "solutions": "500"
                          }
                      };

      httpBackend.expectPOST(url, searchData).respond(
        {
          "kind": "qpxExpress#tripsSearch",
          "trips": {
            "kind": "qpxexpress#tripOptions",
            "requestId": "2fkhMZBIbsxdLVEaJ0NtUJ",
            "data": {
              "kind": "qpxexpress#data"
            }
          }
        });

      spyOn(growl, "error");
      flightSearchService.searchFlight(from, invalidTo, adult, departDate, returnDate, scope);
      httpBackend.flush();

      var flightResults = flightSearchService.getFlightResult();
      expect(flightResults.length).toBe(0);
      expect(growl.error).toHaveBeenCalledWith("No trips can be found for this inputs!");
    });
  });
});
