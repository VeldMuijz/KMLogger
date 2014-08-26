$(function () {

    alert("tracking.js");

    $('#geolocation').val('Trying to find geolocation...');

    var lat = 0;
    var lon = 0;
    var name = 'jeroenAndroid';
    var timestamp = 0;
    var groupKey = '1234##kk';

    //// Declare a proxy to reference the hub.
    var hub = $.connection.dTHub;
    $.connection.hub.url = 'http://sab.jeroenveldhuijzen.nl:1330/signalr'
    //alert('connected?');

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
    //// Get the user name and store it to prepend to messages.
    //$('#displayname').val(prompt('Enter your name:', ''));


    //// Set initial focus to message input box.
    ////$('#message').focus();

    $('#connected').val('Connecting to signalR hub...');

    //// Start the connection.
    $.connection.hub.start().done(function () {
        $('#connected').val('Connected to hub..');

        hub.server.joinGroup(groupKey);
        //    var i = 0;
        //    while (i < 1) {

        //        $('#syncindicator').val('Starting sync...');
        //        setTimeout(function () {

        //            $('#syncindicator').val('Waiting for sync...');
        //        }, 3000);

        //        i++;



        //navigator.geolocation.getCurrentPosition(onSuccess, onError);

        //    $('#sendmessage').click(function () {
        //        // Call the Send method on the hub.
        //        chat.server.send($('#displayname').val(), $('#message').val());
        //        // Clear text box and reset focus for next comment.
        //        $('#message').val('').focus();
        //    });
        //});


        // onSuccess Geolocation
        //
        function onSuccess(position) {
            alert('got geolocation1')
            $('geo-status').val('Connected to GPS')
            lat = position.coords.latitude;
            lon = position.coords.longitude
            timestamp = position.timestamp;
            name = $('#displayname').val();
            hub.server.sendLocation(name, lat, lon, timestamp, groupKey);
            var element = document.getElementById('geolocation');
            alert('got geolocation2')
            element.innerHTML = 'Latitude: ' + position.coords.latitude + '<br />' +
                                'Longitude: ' + position.coords.longitude + '<br />' +
                                'Altitude: ' + position.coords.altitude + '<br />' +
                                'Accuracy: ' + position.coords.accuracy + '<br />' +
                                'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '<br />' +
                                'Heading: ' + position.coords.heading + '<br />' +
                                'Speed: ' + position.coords.speed + '<br />' +
                                'Timestamp: ' + position.timestamp + '<br />';
        }

        // onError Callback receives a PositionError object
        //
        function onError(error) {
            alert('code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
        }
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }

    );
});
