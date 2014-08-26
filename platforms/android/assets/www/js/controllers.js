angular.module('starter.controllers', [])

.controller('ErrorCtrl', function ($scope) {
    
})

.controller('AccountCtrl', function ($scope) {
})

.controller('LocationCtrl', function ($scope, $timeout, $ionicModal, $http, Locations) {

    $scope.locations = Locations.get(true);
    $scope.location = {};
    $scope.newLocationModal = null;
    $scope.editLocationModal = null;
    $scope.locationPicker = 'start';
    $scope.error = false;
    $scope.errorText = null;


    //Create Modals
    //Create New Location Modal
    $ionicModal.fromTemplateUrl('templates/location-new.html', function (modal) {
        $scope.newLocationModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

    // Create and load the Edit Location Modal
    $ionicModal.fromTemplateUrl('templates/location-detail.html', function (modal) {
        $scope.editLocationModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

    // Create and load the newLocationModal
    // Open our new Location Modal
    $scope.showNewLocation = function () {
        $scope.newLocationModal.show();
    };

    // Open update Locations modal
    $scope.showEditLocation = function (locationId) {
        $scope.location = Locations.get(true, locationId);
        $scope.editLocationModal.show();
    };

    // Delete a location
    $scope.deleteLocation = function (locationId) {
        if (locationId != null) {
            Locations.remove(locationId);

            $scope.editLocationModal.hide();
            $scope.locations = Locations.get(true);
        } else {
            alert('Error: Cannot delete location without location id. LocationId given is: ' + locationId)
        }

    };


    // Create location
    $scope.createLocation = function (location) {

        if (Locations.get(true) != null) {
            $scope.locations = Locations.get(true);
        } else {
            $scope.locations = [];
        }

        var unique = true;
        for(i=0; i < $scope.locations.length; i++){
            var storedLocation = $scope.locations[i];
            if (storedLocation.name === location.name && storedLocation.enabled) {
                unique = false;
                break;
            };

        }
            

        if (unique) {
            Locations.add(location);
            $scope.error = false;

            $scope.newLocationModal.hide();
            $scope.locations = Locations.get(true);
            $scope.location = {};
        } else {
            //show error card
            $scope.errorText = 'The name of the location has to be unique.'
            $scope.error = true;
            //hide the error message after 3 seconds
            $timeout(function () { $scope.error = false }, 3000);
        };

    };

    //Edit the location and update it in localStorage
    $scope.updateLocation = function (location) {
        Locations.update(location);
        $scope.locations = Locations.get(true);
        $scope.locationModal.hide();
    }

    // Close the new task modal
    $scope.closeLocationEditor = function (modal) {
        $scope.locations = Locations.get(true);
        $scope.location = null;
        if (modal === 'edit') {
            $scope.editLocationModal.hide();

        } else {
            $scope.newLocationModal.hide();
        }

    };

})

.controller('TripCtrl', function ($scope, $ionicModal, $timeout, $http, $window, Trips, Locations, Position) {

    $scope.trips = Trips.get();
    $scope.locationPickerModal = null;
    $scope.newLocationModal = null;
    $scope.trackerModal = null;
    $scope.locations = null;
    $scope.positions = [];
    $scope.GPSError = null;
    $scope.GPSActive = true;
    $scope.location = null;
    $scope.test = null;
    $scope.information = true;
    $scope.informationMessage = 'nothing to report';

    $scope.currentPosition = {
        lat: 'lat - nothing',
        lon: 'lon - nothing',
        timestamp: 'not updated'
    };
    var test = null;

    if ($scope.trips != null) {

        var lastTrip = $scope.trips.length -1;

        $scope.trip = {

            //tripId: null,

            startLocation: $scope.trips[lastTrip].endLocation,
            startLocationName: $scope.trips[lastTrip].endLocationName,
            startDate: new Date().dateToday("dd-mm-yyyy"),
            startTime: new Date().timeNow("hh:mm"),
            startKm: $scope.trips[lastTrip].endKm,

            //endLocation: null,
            //endLocationName: null;
            //endDate: null,
            //endTime: null,
            //endKm: null,

            //distance: null,
            //business: true,
            //byGPS: false
        };
    } else {
        $scope.trip = null;

    }



    $scope.destination = true;

    //Create Modal
    //Create Location Picker Modal
    $ionicModal.fromTemplateUrl('templates/location-picker.html', function (modal) {
        $scope.locationPickerModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

    //Create New Location Modal
    $ionicModal.fromTemplateUrl('templates/location-new.html', function (modal) {
        $scope.newLocationModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

    function showInformationPanel(message) {
        
            $scope.informationMessage = message;
            $scope.information = true;
            alert(message)

        //$timeout(function () {
        //    $scope.information = false;
        //}, 3000);
    };

    $scope.selectLocation = function (location) {
        //$scope.location = location;

        if ($scope.locationPicker === 'start') {
            if ($scope.trip.startLocation == null) {
                var now = new Date();
                var day = ((now.getDate() < 10) ? '0' + now.getDate() : now.getDate());
                // Return month with a leading zero when neccessary. 
                // GetMonth() returns jan as 0 so +1 to get right month
                var month = ((now.getMonth() + 1 < 10) ? '0' + now.getMonth() : now.getMonth());
                var year = now.getFullYear();
                var hours = ((now.getHours() < 10) ? '0' + now.getHours() : now.getHours());
                var minutes = ((now.getMinutes() < 10) ? '0' + now.getMinutes() : now.getMinutes());
                var seconds = ((now.getSeconds() < 10) ? '0' + now.getSeconds() : now.getSeconds());


                $scope.trip.startLocation = location.locationId;
                $scope.trip.startLocationName = location.name;
                $scope.trip.startDate = day + '-' + month + '-' + year;
                $scope.trip.startTime = hours + ':' + minutes;
                alert($scope.trip.startDate + '\n' + $scope.trip.startTime)

            } else {

                $scope.trip.startLocation = location.locationId;
            }
            //  $scope.destination = true;
        } else {
            $scope.location = location;

            if ($scope.trip.endLocation == null) {
                var now = new Date();
                var day = ((now.getDate() < 10) ? '0' + now.getDate() : now.getDate());
                // Return month with a leading zero when neccessary. 
                // GetMonth() returns jan as 0 so +1 to get right month
                var month = ((now.getMonth() < 10) ? '0' + now.getMonth() : now.getMonth()) + 1;
                var year = now.getFullYear();
                var hours = ((now.getHours() < 10) ? '0' + now.getHours() : now.getHours());
                var minutes = ((now.getMinutes() < 10) ? '0' + now.getMinutes() : now.getMinutes());
                var seconds = ((now.getSeconds() < 10) ? '0' + now.getSeconds() : now.getSeconds());

                $scope.trip.endLocation = location.locationId;
                $scope.trip.endLocationName = location.name;
                $scope.trip.endDate = day + '-' + month + '-' + year;
                $scope.trip.endTime = hours + ':' + minutes

            } else {

                $scope.trip.endLocation = location.locationId;
            }
        }

        $scope.locationPickerModal.hide();

    };

    // Create and load the Tracker Modal
    $ionicModal.fromTemplateUrl('templates/trackerModal.html', function (modal) {
        $scope.trackerModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-left'
    });

    // Store a new trip to LocalStorage
    $scope.saveTrip = function () {
        $scope.trip.distance = $scope.trip.endKm - $scope.trip.startKm;
        Trips.add($scope.trip);

        $window.location.reload();
    };


    $scope.discardTrip = function () {
        
        $window.location.reload();
    };

    function setCurrentPosition(location) {
        $scope.currentPosition.lat = location.coords.latitude;
        $scope.currentPosition.lon = location.coords.longitude;
        $scope.currentPosition.timestamp = new Date().timeNow();

        addLocationToTrip($scope.currentPosition);

    }

    function addLocationToTrip(currentPosition) {
        $scope.positions.push(currentPosition);

    };

    $scope.getPosition = function () {
        
        Position.getLocation().then(function (currentLocation) {
            //$scope.getPosition()

            $scope.GPSActive = true;
            setCurrentPosition(currentLocation);
            $scope.getAddress($scope.currentPosition);
        }, function (status) {
            $scope.GPSActive = false;
            $scope.GPSError = status;
            $scope.GPSActive = false;
        });
    
    }

    

    $scope.showTracker = function () {
        //$scope.currentPosition = Position.getPosition();
        //$timeout(getPosition, 7000);
        $scope.GPSActive = true;
        $timeout(function syncPosition() {
            if ($scope.GPSActive === 'cancel') {

                //stop the syncing.
                return;
            } else {
                $scope.getPosition();
                //run every 3 seconds
                $timeout(syncPosition, 3000);
            }
            
        }, 5000);
        $scope.trackerModal.show();
    };

    $scope.closeTracker = function () {
        $scope.GPSActive = 'cancel';
        $scope.unhideDestination(true);
        $scope.trackerModal.hide();
    };

    // Open new Location Modal
    $scope.showNewLocation = function () {
        $scope.location = null;
        $scope.newLocationModal.show();

    };

    // Open new Location creation Modal
    $scope.closeLocationEditor = function () {
        $scope.location = null;
        $scope.newLocationModal.hide();

    };

    // Open location picker modal
    $scope.showLocationPicker = function (type) {
        $scope.locationPicker = type;
        $scope.locations = Locations.get(true);
        $scope.locationPickerModal.show();
    }
    // Close location picker modal
    $scope.closeLocationPicker = function () {
        $scope.locationPickerModal.hide();
    };

    // Create location
    $scope.createLocation = function (location) {
 
        Locations.add(location);

        $scope.newLocationModal.hide();
        $scope.locations = Locations.get(true);
        $scope.location = {};
    };

    $scope.unhideDestination = function (gps) {
        if (gps) {

            var positions = $scope.positions;
            alert(angular.toJson(positions));
            $scope.trip.endDate = new Date().dateToday('dd-mm-yyyy');
            $scope.trip.endTime = positions[positions.length -1].timestamp;
            
        }

        $scope.destination = false;
    }

    $scope.startTracker = function () {
        alert('Starting tracker')


        $timeout(function () {
            $scope.locationdetails = Position.get();
        });
    }

    $scope.getAddress = function (currentPosition) {

        Position.getLocationDetails(currentPosition).then(function (result) {
            //alert(result.results[0].formatted_address);
            //$scope.currentAddress = result.results[0].formatted_address;
            $scope.currentAddress = result.results[0].address_components[1].short_name + '\n' + result.results[0].address_components[1].long_name + ' ' + result.results[0].address_components[0].short_name + ', ' + result.results[0].address_components[2].short_name

        }, function (result) {
            $scope.currentAddress = 'Address resolving failed. ' + result;
           // showInformationPanel('Address resolving failed.')
        });
    }



})

.controller('TrackerCtrl', function ($scope, $interval, $http, $timeout, Position, ServerConnection, Customers) {
    console.log('Trackercontroller')
    // Position
    $scope.locationdetails = Position.get();



    // ServerConnection
    // $scope.connect = ServerConnection.connect();
    $scope.checkConnection = function () {
        ServerConnection.internetConnection();
    }

    $scope.timer = function () {
        $interval(function () {
            ServerConnection.internetConnection();

        }, 1000);
    }
    $scope.internetConnection = function () {
        $interval(function () {
            ServerConnection.internetConnection();

        }, 1000);
    }

    // Customers
    $scope.customers = Customers.get();

});
