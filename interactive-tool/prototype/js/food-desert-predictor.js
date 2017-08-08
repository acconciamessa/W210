
function predictLikelihood(tract_id, feature_values, year) {
  // Use a pretrained model to predict the likelihood that a given census tract is a food desert
  var x = (2.398 * feature_values[0]) + // % of population in group hosing
          (0.0352 * feature_values[1]) + // % of empty houses
          (0.0348 * feature_values[2]) + // Total population with no college degree
          (0.0099 * feature_values[3]); // Unemployment rate among those with some college or associate's degree"

  var score = 1.0 / (1.0 + Math.exp(-1.0 * x));
 
  // returns 0, 1, or 2 corresponding to low, medium, or high food desert likelihood 
  if (score > 0.75) {
    return 2.0;
  }
  else if (score > 0.5) {
    return 1.0;
  }
  else {
    return 0.0;
  }

  // Output feature values for debug purposes
  /*
  output = String(tract_id) + ":\t[";
  for (var i = 0; i < feature_values.length; i++) {
    output += String(feature_values[i]);
    if (i != feature_values.length -1) {
      output += ", ";
    }
  }
  output = output + "], " + String(year);
  console.log(output);
  */
}