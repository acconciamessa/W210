
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
                                  .attr('id', 'widget_expander')
                                  .attr('onClick', 'openControlWidget()')
                                  .attr('title', 'Open Controls')
                                  .text('<<');
  
  num_features = 4;
  feature_handles = [null, null, null, null];
  reset_buttons = [null, null, null, null];
  feature_names = ['Feature Number 1', 'Feature Number 2', 'Feature Number 3', 'Feature Number 4'];
  feature_operators = ['x', 'x', 'x', 'x'];
  feature_values = [100, 100, 100, 100];
  feature_units = ['%', '%', '%', '%'];
  current_year = 2010;
} // End of initializeMap() function


function openControlWidget() {
  var control_width = 350;
  
  // Expand widget
  control_widget.style('width', control_width)
                .style('left', '550px');
                
  // Repurpose widget expander to close widget
  widget_expander.attr('onclick', 'closeControlWidget()')
                 .attr('title', 'Close Controls')
                 .text('>>');
                 
  // Create feature control title box
  control_widget.append("text")
                .text('Feature Manipulation')
                .style('top', '20px');
                
  // Loop over feature arrays to create individual feature controls        
  for (var i = 0; i < num_features; i++) {
    feature_handles[i] = control_widget.append("div")
                                       .attr('id', 'feature_control')
                                       .style('top', String(50 + (40*i)));
                                       
    // Add feature name     
    feature_handles[i].append("text")
                      .attr('id', 'feature_name')
                      .text(feature_names[i]);
                      
    // Add feature operator dropdown         
    feature_handles[i].append('select')
                      .attr('title', 'Select Operator')
                      .attr('value', String(feature_operators[i]))
                      .attr('id', 'operator');
    feature_handles[i].select("#operator").append('option').text('x').attr('selected', 'selected');           
    feature_handles[i].select("#operator").append('option').text('+');
    feature_handles[i].select("#operator").append('option').text('-');
        
    // Add feature value input field          
    feature_handles[i].append("input")
                      .attr('title', 'Enter Value')
                      .attr('type', 'text')
                      .attr('value', String(feature_values[i]))
                      .attr('id', 'value');

    // Add feature unit dropdown
    feature_handles[i].append('select')
                      .attr('title', 'Select Unit')
                      .attr('value', String(feature_units[i]))
                      .attr('id', 'unit');
    feature_handles[i].select("#unit").append('option').text('%').attr('selected', 'selected'); 
    feature_handles[i].select("#unit").append('option').text('$');
    feature_handles[i].select("#unit").append('option').text('\u00B0F');
    feature_handles[i].select("#unit").append('option').text('lb.');  
      
    // Add feature reset button                
    feature_handles[i].append('button')
                      .attr('name', 'reset_' + String(i))
                      .attr('title', "Reset " + String(feature_names[i]))
                      .attr('id', 'reset')
                      .text('\u21BA')
                      .on('click', function(){resetFeature(parseInt(this.name.slice(-1)))});
                      
  } // End of feature creation loop

  
  // Create year control title box
  control_widget.append("text")
                .text("Year")
                .style('top', String(20 + (40*(num_features+1))));
   
  // Create year control             
  year_control = control_widget.append("div")
                               .attr('id', 'year_control')
                               .style('top', String(10 + (40*(num_features + 2))));
  
  year_control.append("button")
              .attr('id', 'subtract_year')
              .attr('onClick', 'subtractYear()')
              .attr('title', 'Subtract Year')
              .text('-')
              .style('left', '25%');
              
  year_control.append("input")
                      .text(feature_values[i])
                      .attr('title', 'Enter Year')
                      .attr('type', 'text')
                      .attr('id', 'year')
                      .attr('value', String(current_year));
  
  year_control.append("button")
              .attr('id', 'add_year')
              .attr('onClick', 'addYear()')
              .attr('title', 'Add Year')
              .style('left', '68%')
              .text('+');
              
  // Create recolor map button
  control_widget.append("button")
                .attr('id', 'recolor_map')
                .attr('onClick', 'recolorMap()')
                .attr('title', 'Recolor Map With Current Values')
                .text('Recolor Map')
                .style('top', String(25 + (40*(num_features + 3))));
  
  // Create legend title box
  control_widget.append("text")
                .text("Legend")
                .style('top', String(40 + (40*(num_features+4))));

                
  // Create low risk box           
  low_risk = control_widget.append("div")
                           .attr('id', 'low_risk')
                           .style('top', String(30 + (40*(num_features + 5))));
                      
  low_risk.append('div').attr('id', 'key');
  low_risk.append('text').attr('id', 'value').text('Low Risk Area');

  
  // Create medium risk box
  medium_risk = control_widget.append("div")
                              .attr('id', 'medium_risk')
                              .style('top', String(30 + (40*(num_features + 6))));
  
  medium_risk.append('div').attr('id', 'key');
  medium_risk.append('text').attr('id', 'value').text('Medium Risk Area');
          
  // Create high risk box           
  high_risk = control_widget.append("div")
                            .attr('id', 'high_risk')
                            .style('top', String(30 + (40*(num_features + 7))));

  high_risk.append('div').attr('id', 'key');
  high_risk.append('text').attr('id', 'value').text('High Risk Area');
  
} // End of openControlWidget() function

function closeControlWidget(){
  
  // Clear all control widget children from the DOM
  control_widget.selectAll('*').remove();
  control_widget.style('width', '2%')
                .style('left', '98%');
  
  // Re-add the widget expander button to the control widget
  widget_expander = control_widget.append('button')
                                  .attr('id', 'widget_expander')
                                  .attr('onClick', 'openControlWidget()')
                                  .attr('title', 'Open Controls')
                                  .text('<<');
                                  
} // End of closeControlWidget() function


function resetFeature(reset_id){
  alert("resetFeature(" + String(reset_id+1) + ") function not yet implemented");
  
  //feature_operators[reset_id] = 'x';
  //feature_values[reset_id] = 111 * (reset_id+1);
  //feature_units[reset_id] = '%';
  
  //feature_handles[reset_id].select("#operator");
  //feature_handles[reset_id].select("#value").attr('value', String(feature_values[reset_id]));
  //feature_handles[reset_id].select("#unit");
  
} // End of resetFeature(reset_id) function


function subtractYear(){
  current_year = Math.max(current_year-1, 2010);
  year_control.select("input").attr('value', String(current_year));
  
} // End of subtractYear() function


function addYear(){
  current_year = Math.min(current_year+1, 2020);
  year_control.select("input").attr('value', String(current_year));
  
} // End of addYear() function


function recolorMap(){
   alert("recolorMap() function not yet implemented");
   
} // End of recolorMap() function
