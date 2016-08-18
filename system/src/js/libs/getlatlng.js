var undef;
var $ = jQuery = require('jquery');

module.exports = function(searchString, projection, callback) {

    searchString = searchString.replace(/ /g, '+');

    $.getJSON( "http://maps.googleapis.com/maps/api/geocode/json?address="+searchString, function( data ) {

        console.log(data);

        var geoPos = {
            'lat': data.results[0].geometry.location.lat,
            'lng': data.results[0].geometry.location.lng
        };
        
        var projectedPos = projection([ geoPos.lng, geoPos.lat ]);

        var pxPos = {
            'x': projectedPos[0],
            'y': projectedPos[1]
        };

        callback.call(undef, geoPos, pxPos);

    });

};