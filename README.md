# panoroutef - Google Street View Panorama Finder
google maps streetview panorama finder

Library to help finding Google Street View Panoramas on a given route or polyline lat leng.

Given a Google Maps Route or lat leng coords Array (get from a Polyine f.i.), this library looks for Google Street Views Panorama and return an array with all the finded coords.

## Simple Example

```js
// Create a panoroutef object
 panorf = new PANOROUTEF.Loader();

// Implement the onPanoramaProgress handler

 panorf.onProgress = function () {

   var objProgress = this.getProgress();

 };
  
  // on rendered callback
  panorf.onRendered= function() {

    var objRendered = this.getRendered();
            
   };

//Render Route

panorf.setPath(latlngStart,latlngStop,"DRIVEN","FULL", latlngPolyline);



## Installation

##### Dependencies:

Remember that you'll need google.maps API, so don't forget this script tag.

```html
<script src="http://maps.google.com/maps/api/js?sensor=false"></script>
````



## API Reference

##### Events

 * `panorf.onProgress ()` When a route has been added and it's looking for SV Panoramas
 * `panorama.onRendered ()` When the road has been fool scaned for Panoramas
 


##### Methods

 * `setPath (latlngStart,latlngStop,"DRIVEN","FULL", latlngPolyline);





##### Forks, pull requests and code critiques are welcome!

## License

MIT License (MIT)

