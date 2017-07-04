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
  feature_names = ['Feature Number 1', 'Feature Number 2', 'Feature Number 3', 'Feature Number 4'];
  feature_operators = ['+', '+', '-', 'X'];
  feature_values = ['######', '######', '######', '######'];
  feature_units = ['$', '\u00B0F', 'lb.', '%'];
}

function openControlWidget() {
  var control_width = 350;
  
  // Expand widget
  control_widget.style('width', control_width)
                .style('left', '550px');
  widget_expander.attr('onclick', 'closeControlWidget()')
                 .attr('title', 'Close Controls')
                 .text('>>');
                 
  // Populate widget
  
  // Feature manipulation title box
  control_widget.append("text")
                .text('Feature Manipulation')
                .style('text-align', 'center')
                .style('width', '100%')
                .style('height', '20px')
                .style('color', 'white')
                .style('position', 'absolute')
                .style('top', '20px')
                .style('z-index', '3');
        
  // Loop over feature arrays to create individual feature controls        
  for (i = 0; i < num_features; i++) {
    feature_handles[i] = control_widget.append("div")
                                       .attr('id', 'feature_control')
                                       .style('position', 'absolute')
                                       .style('width', '100%')
                                       .style('height', '20px')  
                                       .style('left', '2%')
                                       .style('top', String(60 + (40*i)))
                                       .style('z-index', '3');
             
    // Feature name     
    feature_handles[i].append("text")
                      .text(feature_names[i])
                      .style('text-align', 'center')
                      .style('height', '20px') 
                      .style('width', '38%')
                      .style('color', 'white')                   
                      .style('position', 'absolute')
                      .style('z-index', '3');
         
    // Feature operator             
    var dropdown = feature_handles[i].append('select')
                                     .attr('title', 'Operator')
                                     .style('text-align', 'center')
                                     .style('height', '20px') 
                                     .style('width', '12%')                     
                                     .style('position', 'absolute')
                                     .style('z-index', '3')
                                     .style('left', '40%');
    dropdown.append('option').text('+');
    dropdown.append('option').text('-');
    dropdown.append('option').text('x');                
        
    // Feature value              
    feature_handles[i].append("input")
                      .text(feature_values[i])
                      .attr('title', 'Value')
                      .style('text-align', 'center')
                      .style('height', '20px') 
                      .style('width', '18%')
                      .style('color', 'black')
                      .style('position', 'absolute')
                      .style('z-index', '3')
                      .style('left', '54%');
                      
    // Feature units
    dropdown = feature_handles[i].append('select')
                                 .attr('title', 'Units')
                                 .style('text-align', 'center')
                                 .style('height', '20px') 
                                 .style('width', '12%')                     
                                 .style('position', 'absolute')
                                 .style('z-index', '3')
                                 .style('left', '74%');
    dropdown.append('option').text('$');
    dropdown.append('option').text('\u00B0F');
    dropdown.append('option').text('lb.');  
    dropdown.append('option').text('%'); 
      
    // Reset button                
    feature_handles[i].append('button')
                      .text('\u21BA')
                      .attr('title', 'Reset Feature')
                      .style('border-style', 'none')
                      .style('height', '20px')
                      .style('width', '20px')
                      .style('color', 'white')
                      .style('background-color', 'transparent')
                      .style('position', 'absolute')
                      .style('font-size', '80%')
                      .style('z-index', '3')
                      .style('left', '90%')
                      .style('top', '0%');
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