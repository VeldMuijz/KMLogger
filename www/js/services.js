angular.module('starter.services', [])


/**
 * A simple example service that returns some data.
 */
.factory('Friends', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var friends = [
      { id: 0, name: 'Scruff McGruff' },
      { id: 1, name: 'G.I. Joe' },
      { id: 2, name: 'Miss Frizzle' },
      { id: 3, name: 'Ash Ketchum' }
    ];

    return {
        all: function () {
            return friends;
        },
        get: function (friendId) {
            // Simple index lookup
            return friends[friendId];
        },

    }
})

//Locations
.factory('Locations', function ($http) {

    return {
        get: function (enabled, locationId) {
            var locations = angular.fromJson(window.localStorage.getItem('Locations'));

            if (locations != null) {
                if (locationId != null) {
                    //return enabled location by locationId


                    for (var i = 0; i < locations.length; i++) {
                        if (locations[i].locationId === locationId && (locations[i].enabled == true)) {
                            //alert('Found it!: ' + locations[i].locationId + '\n' + locations[i].name);

                            return locations[i];
                        }

                    }
                    // angular.fromJson(window.localStorage['Locations']);

                } else {
                    //return all enabled locations (default action)
                    if (enabled = true) {
                        var locations = angular.fromJson(window.localStorage['Locations']);
                        for (var i = 0; i < locations.length; i++) {
                            if (locations[i].enabled == false) {

                                locations.splice(i, 1);
                            }
                        }
                        return locations;

                    } else {

                        //return enabled and disabled locations 
                        return locations;
                    }


                }
            } else {
                locations = {};
                return locations;
            }



        },
        save: function (locations) {
            window.localStorage['Locations'] = angular.toJson(locations);
        },
        remove: function (locationId) {
            //delete the location
            var locations = angular.fromJson(window.localStorage.getItem('Locations'));


            for (var i = 0; i < locations.length; i++) {
                if (locations[i].locationId === locationId) {
                    // alert('Can delete!: ' + locations[i].locationId + '\n' + locations[i].name);

                    locations[i].enabled = false;

                    window.localStorage['Locations'] = angular.toJson(locations);

                }

            }
        }, add: function (location) {
            var locations = angular.fromJson(window.localStorage['Locations']);
            location.enabled = true;

            if (locations != null) {
                location.locationId = locations.length + 1;

            } else {
                // first location
                locations = [];
                location.locationId = 1;
            }

            locations.push(location);

            window.localStorage['Locations'] = angular.toJson(locations);

        }, update: function (location) {
            var locations = angular.fromJson(window.localStorage.getItem('Locations'));

            for (var i = 0; i < locations.length; i++) {
                if (locations[i].locationId === location.locationId) {
                    //alert('Can update!: ' + locations[i].locationId + '\n' + locations[i].name);

                    locations[i] = location;

                    window.localStorage['Locations'] = angular.toJson(locations);

                }
            }

        }

    }

})

    //Locations
.factory('Trips', function ($http) {
    var trips = [
        {
            id: 1,
            startLocation: 1,
            startDate: new Date('2014-04-20T18:45'),
            endDate: new Date('2014-04-20T19:45'),
            //duration : Math.abs(this.endDate.getTime() - this.startDate.getTime()),
            endLocation: 1,
            length: 55,
            business: true
        },
        {
            id: 2,
            endLocation: 2,
            startDate: new Date('2014-04-20T18:45'),
            endDate: new Date('2014-04-20T19:45'),
            //duration : Math.abs(this.endDate.getTime() - this.startDate.getTime()),
            endStreet: 'Indigohof 14',
            endCity: 'Almere',
            length: 23,
            businness: true
        }
    ]


    return {
        get: function (tripId) {

            if (tripId != null) {
                //return trip by tripId
                var trips = angular.fromJson(window.localStorage.getItem('Trips'));

                for (var i = 0; i < trips.length; i++) {
                    if (trips[i].tripId === tripId) {
                        //alert('Found it!: ' + trips[i].tripId + '\n' + trips[i].name);
                        return trips[i];
                    }

                }
                // angular.fromJson(window.localStorage['trips']);

            } else {
                //return all trips (default action)
                var trips = angular.fromJson(window.localStorage.getItem('Trips'));

                return trips;
            }

        }, save: function (trip) {
            //TODO: Create the Trips object and save to store.            

        },
        add: function (trip) {
            var trips = angular.fromJson(window.localStorage['Trips']);
            trip.enabled = true;

            if (trips != null) {
                trip.tripId = trips.length + 1;

            } else {
                // first trip
                trips = [];
                trip.tripId = 1;
            }

            trips.push(trip);

            window.localStorage['Trips'] = angular.toJson(trips);

            
        }, update: function (trip) {
            var trips = angular.fromJson(window.localStorage.getItem('Trips'));

            for (var i = 0; i < trips.length; i++) {
                if (trips[i].tripId === trip.tripId) {

                    trips[i] = trip;

                    window.localStorage['Trips'] = angular.toJson(trips);

                }
            }
        },
        remove: function (trip) {
            var trips = angular.fromJson(window.localStorage.getItem('Trips'));

            for (var i = 0; i < trips.length; i++) {
                if (trips[i].tripId === trip.tripId) {

                    trips.splice(i, 1);

                    window.localStorage['Trips'] = angular.toJson(trips);

                }
            }
        }

    }

})


.constant('geolocation_msgs', {
    'errors.location.unsupportedBrowser':'Browser does not support location services',
    'errors.location.permissionDenied':'You have rejected access to your location',
    'errors.location.positionUnavailable':'Unable to determine your location',
    'errors.location.timeout':'Service timeout has been reached'
})

  .factory('Position', ['$q','$rootScope', '$window', 'geolocation_msgs','$http', function ($q, $rootScope, $window, geolocation_msgs, $http, $timeout) {

      var opts = { enableHighAccuracy: true };
      return {
          getLocation: function (opts) {
              var deferred = $q.defer();
              if ($window.navigator && $window.navigator.geolocation) {
                  $window.navigator.geolocation.getCurrentPosition(function (position) {
                      $rootScope.$apply(function () { deferred.resolve(position); });
                  }, function (error) {
                      switch (error.code) {
                          case 1:
                              $rootScope.$broadcast('error', geolocation_msgs['errors.location.permissionDenied']);
                              $rootScope.$apply(function () {
                                  deferred.reject(geolocation_msgs['errors.location.permissionDenied']);
                              });
                              break;
                          case 2:
                              $rootScope.$broadcast('error', geolocation_msgs['errors.location.positionUnavailable']);
                              $rootScope.$apply(function () {
                                  deferred.reject(geolocation_msgs['errors.location.positionUnavailable']);
                              });
                              break;
                          case 3:
                              $rootScope.$broadcast('error', geolocation_msgs['errors.location.timeout']);
                              $rootScope.$apply(function () {
                                  deferred.reject(geolocation_msgs['errors.location.timeout']);
                              });
                              break;
                      }
                  }, opts);
              }
              else {
                  $rootScope.$broadcast('error', geolocation_msgs['errors.location.unsupportedBrowser']);
                  $rootScope.$apply(function () { deferred.reject(geolocation_msgs['errors.location.unsupportedBrowser']); });
              }
              return deferred.promise;
          },
          getLocationDetails: function (position) {

              if (position.lat != 0 && position.lon != 0) {

                  var url =
                      'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
                      position.lat + ',' + position.lon +
                      '&key=AIzaSyCFcetMbnvgLUedR10xalexobFBJ8bNhMU'

                  //Get JSON with reverse geocoded address 
                  var geocode = $http.get(url).then(function (response) {

                      return response.data;
                  }, function (response) {

                      //alert('Address resolving failed');
                      var status = response;
                      return status;

                  });

                  return geocode;
              }
          }

      };
      
  }]);

////Position related logic
//.factory('Position', ['$q','$rootScope','$window','geolocation_msgs',function ($http, $timeout, $q,$rootScope,$window,geolocation_msgs){

//    var locationDetails = {
//        lat: 0,
//        lon: 0,
//        address: 'default address',
//        name: 'jeroenAndroid',
//        timestamp: 0,
//        groupKey: '1234##kk'
//    };


//    return {
//        get: function () {
//            if (locationDetails === null) {
//                locationDetails = {
//                    lat: 0,
//                    lon: 0,
//                    name: 'jeroenAndroid',
//                    timestamp: 0,
//                    groupKey: '1234##kk'
//                };

//            }
//            return locationDetails;
//        },


//    getAddress: function () {

//        if (locationDetails.lat != 0 && locationDetails.lon != 0) {

//            var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + locationDetails.lat + ',' + locationDetails.lon + '&key=AIzaSyCFcetMbnvgLUedR10xalexobFBJ8bNhMU'
//            //Get JSON with reverse geocoded address 
//            var geocode = $http.get(url).then(function (response) {

//                alert('service function')
//                locationDetails.address = response.data.results[0].formatted_address;
//                return response.data;
//            }, function (response) {

//                alert('Address resolving failed');

//            });

//            return geocode;
//        }

//    }
//}
//);

