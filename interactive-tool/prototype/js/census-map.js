function initializeMap() {
  // Create map object
  var map = new L.Map('map', {
  	center: [37.770, -122.41],
  	zoom: 6
  });
  
  // Remove leaflet attribution from the map (we'll put attributions somewhere else)
  document.getElementsByClassName('leaflet-control-attribution')[0].style.display = 'none';
  
  // Add base layer to map
  // TODO: can/should the base layer be stored locally?
  base_layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
  base_layer.addTo(map);
  
  // Add census layer to map
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
  

	           
  // TODO: create d3 handles for control widget objects
  body = d3.select('body');
  map_container = body.select('#map_container');
  census_map = map_container.select('#map');
  control_widget = map_container.select('#control_widget');
  widget_expander = control_widget.append('button')
                                  .attr('name', 'widget_expander')
                                  .attr('onClick', 'openControlWidget()')
                                  .attr('title', 'Open Controls')
                                  .text('<<');
  
  num_features = 4;
  feature_handles = [null, null, null, null];
  feature_names = ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'];
  feature_operators = ['+', '+', '-', 'X'];
  feature_values = ['######', '######', '######', '######'];
  feature_units = ['$', '\u00B0F', 'lb.', '%'];
}

function openControlWidget() {
  // Expand widget
  control_widget.style('width', '40%')
                .style('left', '60%');
  widget_expander.attr('onclick', 'closeControlWidget()')
                 .attr('title', 'Close Controls')
                 .text('>>');
                 
  // Populate widget
  
  // Feature manipulation title box
  control_widget.append("text")
                .text("Feature Manipulation")
                .style('width', '200px')
                .style('height', '30px')
                .style('color', 'white')
                .style('position', 'absolute')
                .style('left', '70px')
                .style('top', '20px')
                .style('z-index', '3');
        
  // Loop over feature arrays to create individual feature controls        
  for (i = 0; i < num_features; i++) {
    feature_handles[i] = control_widget.append("div")
                                       .attr('id', 'feature_control')
                                       .style('position', 'absolute')
                                       .style('width', '80%')
                                       .style('height', '30px')
                                       .style('left', '5%')
                                       .style('top', String(60 + (40*i)))
                                       .style('z-index', '3');
             
    // Feature name     
    feature_handles[i].append("text")
                      .text(feature_names[i])
                      .style('text-align', 'center')
                      .style('width', '60px')
                      .style('color', 'white')
                      .style('position', 'absolute')
                      .style('z-index', '3');
         
    // Feature operator             
    feature_handles[i].append("text")
                      .text(feature_operators[i])
                      .style('text-align', 'center')
                      .style('width', '30px')
                      .style('color', 'white')
                      .style('position', 'absolute')
                      .style('z-index', '3')
                      .style('left', '80px');
        
    // Feature value              
    feature_handles[i].append("text")
                      .text(feature_values[i])
                      .style('text-align', 'center')
                      .style('width', '60px')
                      .style('color', 'white')
                      .style('position', 'absolute')
                      .style('z-index', '3')
                      .style('left', '120px');
                      
    // Feature units                  
    feature_handles[i].append("text")
                      .text(feature_units[i])
                      .style('text-align', 'center')
                      .style('width', '40px')
                      .style('color', 'white')
                      .style('position', 'absolute')
                      .style('z-index', '3')
                      .style('left', '180px');
      
    // Reset button                
    feature_handles[i].append("text")
                      .text('\u238c')
                      .style('text-align', 'center')
                      .style('width', '30px')
                      .style('color', 'white')
                      .style('position', 'absolute')
                      .style('z-index', '3')
                      .style('left', '230px');
  } // End of feature loop

}

function closeControlWidget(){
  
  // Clear all children from the DOM
  control_widget.selectAll('*').remove();
  control_widget.style('width', '2%')
                .style('left', '98%');
  
  // Remake the widget expander button
  widget_expander = control_widget.append('button')
                                  .attr('name', 'widget_expander')
                                  .attr('onClick', 'openControlWidget()')
                                  .attr('title', 'Open Controls')
                                  .text('<<');
}