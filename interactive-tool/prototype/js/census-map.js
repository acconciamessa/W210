
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
  possible_operators = ['+', '-', 'x'];
  possible_units = [['%', '$', '\u00B0F', 'lb'],
                    ['%', '$', '\u00B0F', 'lb'],
                    ['%', '$', '\u00B0F', 'lb'],
                    ['%', '$', '\u00B0F', 'lb']];
  
  feature_handles = [null, null, null, null];
  feature_names = ['Feature Number 1', 'Feature Number 2', 'Feature Number 3', 'Feature Number 4'];
  feature_operators = ['+', '+', '+', '+'];
  feature_values = [0, 0, 0, 0];
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
    feature_handles[i] = control_widget.append("form")
                                       .attr('class', 'feature_control')
                                       .attr('name', 'feature_' + String(i))
                                       .style('top', String(50 + (40*i)));
                                       
    // Add feature name     
    feature_handles[i].append("text")
                      .attr('class', 'feature_name')
                      .text(feature_names[i]);
                      
    // Add feature operator dropdown         
    feature_handles[i].append("select")
                      .attr('title', 'Select Operator')
                      .attr('id', 'operator');
    
    // Add operator selection options (default selection == feature_operators[i])
    // TODO: Find a cleaner way to do this
    for (j = 0; j < possible_operators.length; j++) {
      if (possible_operators[j] == feature_operators[i]) {
        feature_handles[i].select("#operator").append("option")
                                              .attr('name', possible_operators[j])
                                              .attr('selected', 'selected')
                                              .text(possible_operators[j]);
      }
      else {
        feature_handles[i].select("#operator").append("option")
                                              .attr('name', possible_operators[j])
                                              .text(possible_operators[j]);
      }
    }
    
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
                      
    // Add unit selection options (default selection == feature_units[i])
    // TODO: Find a cleaner way to do this
    for (j = 0; j < possible_units[i].length; j++) {
      if (possible_units[i][j] == feature_units[i]) {
        feature_handles[i].select("#unit").append("option")
                                            .attr('name', possible_units[i][j])
                                            .attr('selected', 'selected')
                                            .text(possible_units[i][j]);
      }
      else {
        feature_handles[i].select("#unit").append("option")
                                            .attr('name', possible_units[i][j])
                                            .text(possible_units[i][j]);
      }
    }
      
    // Add feature reset button                
    feature_handles[i].append("input")
                      .attr('type', 'button')
                      .attr('title', "Reset " + String(feature_names[i]))
                      .attr('id', 'reset_button')
                      .attr('name', 'reset_' + String(i))
                      .attr('value', '\u21BA')
                      .on('click', function() {resetFeature(parseInt(this.name.slice(-1)));});
                      
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
              
  year_control.append("text")
              .attr('id', 'year')
              .text(String(current_year));

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
  // Gather user-defined information
  saveFeatureInput();
  
  // Clear all control widget children from the DOM and shrink the widget
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


function subtractYear(){
  current_year = Math.max(2010, current_year - 1);
  year_control.select("#year").text(String(current_year));
} // End of subtractYear() function


function addYear(){
  current_year = Math.min(2020, current_year + 1);
  year_control.select("#year").text(String(current_year));
} // End of addYear() function


function recolorMap(){
  // Gather user-defined information
  saveFeatureInput();
  
  // TODO: Use the user-defined information to recolor map
  var output = "Function \"recolorMap()\" has not been implemented yet.\n\n";
  output = output +  "Current year:\t" + String(current_year) + "\n\n";
  output = output + "Current user-defined feature manipulations:\n\n";
  for (i = 0; i < num_features; i++) {
   output = output + "(Feature " + String(i+1) + ")\t";
   output = output + feature_operators[i] + "\t";
   output = output + feature_values[i] + "\t\t";
   output = output + feature_units[i] + "\n";
   }
   
   alert(output);
} // End of recolorMap() function


function saveFeatureInput() {
   for (var i = 0; i < num_features; i++) {
    feature_operators[i] = feature_handles[i].select("#operator").node().value;
    feature_values[i] = feature_handles[i].select("#value").node().value;
    feature_units[i] = feature_handles[i].select("#unit").node().value;
  }
}


function resetFeature(reset_id) {
  // Revert current operator to default
  feature_operators[reset_id] = '+';
  var operators = feature_handles[reset_id].select("#operator").node().options;
  for (var i = 0; i < operators.length; i++) {
    if (operators[i].getAttribute('name') == feature_operators[reset_id]) {
      operators[i].setAttribute('selected', 'selected');
    }
    else {
      operators[i].removeAttribute('selected');
    }
  }
  
  // Revert current value to default
  feature_values[reset_id] = 0;
  feature_handles[reset_id].select('#value').attr('value', feature_values[reset_id]);
  
  // Revert current unit to default
  feature_units[reset_id] = '%';
  var units = feature_handles[reset_id].select("#unit").node().options;
  for (i = 0; i < units.length; i++) {
    if (units[i].getAttribute('name') == feature_units[reset_id]) {
      units[i].setAttribute('selected', 'selected');
    }
    else {
      units[i].removeAttribute('selected');
    }
  }
  
  // Reset form with current operator/value/unit
  feature_handles[reset_id].node().reset();
}