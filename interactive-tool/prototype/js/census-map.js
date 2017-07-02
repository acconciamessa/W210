// Create map
var map = new L.Map('map', {
	center: [37.770, -122.41],
	zoom: 6
})

// Remove leaflet attribution from the map (we'll put attributions somewhere else)
document.getElementsByClassName('leaflet-control-attribution')[0].style.display = 'none';

// Add base layer
// TODO: can/should the base layer be stored locally?
base_layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
base_layer.addTo(map);

// Add census layer
census_layer = new L.Shapefile('data/ca-census-tract-shapefiles.zip', {
  style: function(feature) {
    return {color: 'grey',
            opacity: 0.1,
            weight: 1,
            fillColor: 'blue', 
            fillOpacity: (0.1 + 0.35 * (feature.properties.TRACTCE % 3))};
  }
});
census_layer.addTo(map);