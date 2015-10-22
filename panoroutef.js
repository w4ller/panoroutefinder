var PANOROUTEF = PANOROUTEF || {};

PANOROUTEF.LapseLoader = function (parameters) {



    var _parameters = parameters || {},
        _map,
        _startpath,
        _endpath,
        _pathlength,
        _latlengPath = [],
        _latlengRoute = [],
        latlengFixed = [],
        panoramaId = [],
        _latlengprogress,
        _frameprogress,
        _mode,
        _depth,
        _directionsDisplay = new google.maps.DirectionsRenderer({ draggable: true }),
        _directionsService = new google.maps.DirectionsService(),
         sv = new google.maps.StreetViewService(),
        onPathLoad = null,
        onRendered = null,
        onProgress = null;






    try{
        var mapdiv = document.createElement( 'div' );
        mapdiv.id = 'slapsemap';
        mapdiv.style.width = "0px";
        mapdiv.style.height = "0px";
        mapdiv.style.visibility = "hidden";

        document.body.appendChild(mapdiv);


        var mapOptions = {
            zoom: 1,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            center: new google.maps.LatLng(0.0, 0.0)
        };










    }
    catch(error){

        console.log(error)

    }


    this.setPath = function (start,end, mode, depth) {




       _startpath = start;
       _endpath = end;
        _latlengPath = [];
        latlengFixed = [];
        _frameprogress = 0;
        _latlengprogress = 0;
        _depth = depth;


        _mode = mode;


        var self = this;


        _map = new google.maps.Map(document.getElementById('slapsemap'), mapOptions);


        _directionsDisplay.setMap(_map);

        var request = {
            origin: _startpath,
            destination: _endpath,
           travelMode: google.maps.TravelMode[_mode]
        };

        _directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                _directionsDisplay.setDirections(response);


                var rleg = _directionsDisplay.directions.routes[0].legs[0];
                var path = _directionsDisplay.directions.routes[0].overview_path;
                var counter = 0;
                var counterRoute = 0;


                var steplength = _directionsDisplay.directions.routes[0].legs[0].steps.length;
                var lastdistance = _directionsDisplay.directions.routes[0].legs[0].steps[0].path[0];


                for (var i = 0; i <= steplength - 1; i++) {


                    var pathlength = _directionsDisplay.directions.routes[0].legs[0].steps[i].path.length;
                    for (var n = 0; n <= pathlength - 2; n++) {

                        _latlengRoute[counterRoute] = _directionsDisplay.directions.routes[0].legs[0].steps[i].lat_lngs[n];
                        counterRoute++;

                        if (n < pathlength - 1) var distancex = distance(lastdistance, _directionsDisplay.directions.routes[0].legs[0].steps[i].lat_lngs[n + 1]);


                        if (distancex >= 10) {

                            _latlengPath[counter] = _directionsDisplay.directions.routes[0].legs[0].steps[i].lat_lngs[n];
                            counter++;
                            lastdistance = _directionsDisplay.directions.routes[0].legs[0].steps[i].lat_lngs[n];

                            var step = 4;
                            var dist = distance(_directionsDisplay.directions.routes[0].legs[0].steps[i].lat_lngs[n], _directionsDisplay.directions.routes[0].legs[0].steps[i].lat_lngs[n + 1]);
                            var div = dist / step;
                            var bearing = self.getBearing(_directionsDisplay.directions.routes[0].legs[0].steps[i].lat_lngs[n], _directionsDisplay.directions.routes[0].legs[0].steps[i].lat_lngs[n + 1]);

                            for (x = 0; x <= div; x++) {

                                _latlengPath[counter] = self.destinationPoint(_directionsDisplay.directions.routes[0].legs[0].steps[i].lat_lngs[n], bearing, (step * x));
                                counter++;
                            }

                        }


                       


                    }


                }


             

                if (_depth == "FULL") {


                n = 0;
                _frameprogress = 0;

                fixinterval = setInterval(function () {

                    if (n <= _latlengPath.length - 1) {
                        self.fixingRoute(_latlengPath[n]);

                        _latlengprogress = Math.round(((n + 1) * 100) / _latlengPath.length);
                        //  $('#debug').append('<p>Fixing route: '+ n);
                        n++;

                        if (self.onProgress) {
                            self.onProgress();
                        }


                    }


                    else {
                        clearInterval(fixinterval);

                        if (self.onRendered) {
                            self.onRendered();
                        }
                    }

                }, 100);


            }
                else if (_depth == "HALF")

                {

                    n = 0;
                    _frameprogress = 0;
                    fixinterval = setInterval(function () {

                        if (n <= _latlengRoute.length - 1) {
                            self.fixingRoute(_latlengRoute[n]);

                            _latlengprogress = Math.round(((n + 1) * 100) / _latlengRoute.length);
                            //  $('#debug').append('<p>Fixing route: '+ n);
                            n++;

                            if (self.onProgress) {
                                self.onProgress();
                            }


                        }


                        else {
                            clearInterval(fixinterval);

                            if (self.onRendered) {
                                self.onRendered();
                            }
                        }

                    }, 250);


                }



            }



        });


    }




    this.response = function( z ) {
        _map = z;
        console.log( z );
        return _map;
    };

    this.response( _parameters.map || 'none');



    this.getProgress = function(){

        var objProgress = {
            frameprogress: _frameprogress,
            latlengprogress: _latlengprogress,
            latlngPath: _latlengPath[_latlengprogress-2],
            latlngFrame: latlengFixed[_frameprogress-2],



        };

        return objProgress;


    };


    this.getRendered = function(){

        var objRendered = {

            latlngFrame: latlengFixed,
            panoramaId: panoramaId



        };

        return objRendered;


    };






    this.getBearing = function (startLatLen,endLatLen){
        startLat = Math.toRadians(startLatLen.lat());
        startLong = Math.toRadians(startLatLen.lng());
        endLat = Math.toRadians(endLatLen.lat());
        endLong = Math.toRadians(endLatLen.lng());

        var dLong = endLong - startLong;

        var dPhi = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0));
        if (Math.abs(dLong) > Math.PI){
            if (dLong > 0.0)
                dLong = -(2.0 * Math.PI - dLong);
            else
                dLong = (2.0 * Math.PI + dLong);
        }

        return (Math.toDegrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
    }


    function distance  (p1, p2){
        return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2)).toFixed(2);
    }

    this.destinationPoint  = function (latlng, bearing, distance) {

        var alpha1 = Math.toRadians(latlng.lat());
        var R = 6371000; // metres
        var delta1 = Math.toRadians(latlng.lng());
        var d  = distance;
        var brng = Math.toRadians(bearing);
        var nlatlng;
        

        var alpha2 = Math.asin( Math.sin(alpha1)*Math.cos(d/R) +
        Math.cos(alpha1)*Math.sin(d/R)*Math.cos(brng) );
        var delta2 = delta1 + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(alpha1),
                Math.cos(d/R)-Math.sin(alpha1)*Math.sin(alpha2));



        nlatlng = new google.maps.LatLng( Math.toDegrees(alpha2),Math.toDegrees(delta2));

        return nlatlng;



    }

    Math.toDegrees = function(rad)
    {
        return rad*(180/Math.PI);
    }

    Math.toRadians = function(deg)
    {
        return deg * (Math.PI/180);
    }





   this.fixingRoute = function (latlenfix) {

        sv.getPanorama({location: latlenfix, radius: 20}, processSVData);


    }

    function processSVData(data, status) {
        if (status === google.maps.StreetViewStatus.OK) {



           if(onduplicate(latlengFixed,data.location.latLng) == null) {



                latlengFixed.push(data.location.latLng);
               panoramaId.push(data.location.pano);


                _frameprogress = latlengFixed.length+1;









            }



        } else {



            console.error('Street View data not found for this location.');
        }
    }

    function onduplicate(arr, obj) {



       for (n=0;n<=arr.length-1;n++)
       {
           if (arr[n].lat() == obj.lat() && arr[n].lng() == obj.lng() ) return n;


       }
        return null;


    }

}
