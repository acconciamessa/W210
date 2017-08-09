
function predictLikelihood(tract_id, feature_values, year) {
  // TODO: Remove this and implement sigmoid function
  return Math.floor(Math.random() * 3);

  // Use a pretrained model to predict the likelihood that a given census tract is a food desert
  var x = -3.03468234 + // bias term
          (0.0348 * feature_values[0]) + // Total; Estimate; Some college no degree
          (0.0 * feature_values[1]) + // Percent; TENURE 0 Occupied housing units 0 Owner occupied 0 Owned free and clear
          (0.0099 * feature_values[2]) + // Unemployment rate; Estimate; EDUCATIONAL ATTAINMENT 0 Some college or associate's degree
          (0.0 * feature_values[3]) + // TractNum
          (2.197 * feature_values[4]) + // HUNVFlag
          (2.398 * feature_values[5]) + // PCTGQTRS
          (3.524 * feature_values[6]) + // Urban
          (0.0352 * feature_values[7]);  // Percent; OCCUPANCY STATUS 0 Total housing units

  var score = 1.0 / (1.0 + Math.exp(-1.0 * x));
  
  if (score < 0.98) {
    console.log(0)
    //console.log(String(feature_values[3]) + ":\t" + String(score));
  }
  
  // returns 0, 1, or 2 corresponding to low, medium, or high food desert likelihood 
  if (score > 0.9) {
    return 2.0;
  }
  else if (score > 0.9) {
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