locationModule.factory('hub'), function () {
    var locationDetails = [
        { lat: 0, lon: 0, name: 'jeroenAndroid', timestamp: 0, groupKey: '1234##kk' }

    ];

    hub.client.broadcastMessage = function (name, lat, lon, timestamp) {
        //    // Html encode display name and message.
        var encodedName = $('<div />').text(name).html();
        var encodedLat = $('<div />').text(lat).html();
        var encodedLon = $('<div />').text(lon).html();
        var encodedTS = $('<div />').text(timestamp).html();
        //    // Add the message to the page.
        $('#location').append('<li><strong>' + encodedTS + '&nbsp' + encodedName
         + '</strong>:&nbsp;&nbsp;' + encodedLat + ', ' + encodedLon + '.' + '</li>');
    };

    function sendLocation() {

        hub.server.sendLocation(name, lat, lon, timestamp, groupKey, locationDetails);

    }


    // onError Geolocation Callback receives a PositionError object
    function onError(error) {
        alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
    }

    // onSuccess Geolocation
    function onSuccess(position) {
        alert('got geolocation1')
        $('geo-status').val('Connected to GPS')

        locationDetails.lat = position.coords.latitude;
        locationDetails.lon = position.coords.longitude
        locationDetails.timestamp = position.timestamp;
        //name = $('#displayname').val();
        //hub.server.sendLocation(name, lat, lon, timestamp, groupKey, locationDetails);




        //var element = document.getElementById('geolocation');
        //alert('got geolocation2')
        //element.innerHTML = 'Latitude: ' + position.coords.latitude + '<br />' +
        //                    'Longitude: ' + position.coords.longitude + '<br />' +
        //                    'Altitude: ' + position.coords.altitude + '<br />' +
        //                    'Accuracy: ' + position.coords.accuracy + '<br />' +
        //                    'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '<br />' +
        //                    'Heading: ' + position.coords.heading + '<br />' +
        //                    'Speed: ' + position.coords.speed + '<br />' +
        //                    'Timestamp: ' + position.timestamp + '<br />';
    }

    return {
        getLocationDetails: function () {

            return locationDetails;
        },
        connToServer: function () {
            var hub = $.connection.dTHub;
            $.connection.hub.url = 'http://sab.jeroenveldhuijzen.nl:1330/signalr';

            $.connection.hub.start().done(function () {
                alert('Alert 3 - connection succesfull');
                hub.server.joinGroup(groupKey);
                alert('Alert 4 - joined group');

                navigator.geolocation.getCurrentPosition(onSuccess, onError);
            });



        }


    }



    //var lat = 0;
    //var lon = 0;
    //var name = 'jeroenAndroid';
    //var timestamp = 0;
    //var groupKey = '1234##kk';




}
