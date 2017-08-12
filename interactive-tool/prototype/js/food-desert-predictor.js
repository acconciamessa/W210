
function predictLikelihood(tract_id, feature_values) {
  // Use a pretrained model to predict the likelihood that a given census tract is a food desert
  var z = -4.13946 + // bias term
          (0.07896 * feature_values[0]) + // Total; Estimate; Some college no degree
          (0.0 * feature_values[1]) + // Percent; TENURE 0 Occupied housing units 0 Owner occupied 0 Owned free and clear
          (-0.02524 * feature_values[2]) + // Unemployment rate; Estimate; EDUCATIONAL ATTAINMENT 0 Some college or associate's degree
          (0.0 * feature_values[3]) + // TractNum
          (2.34805 * feature_values[4]) + // HUNVFlag
          (0.57217 * feature_values[5]) + // PCTGQTRS
          (3.71905 * feature_values[6]) + // Urban
          (0.0 * feature_values[7]);  // Percent; OCCUPANCY STATUS 0 Total housing units
          
  var score = 1.0 / (1.0 + Math.exp(-1.0 * z));
  

  // returns 0, 1, or 2 corresponding to low, medium, or high food desert likelihood 
  if (score < 0.2) {
    return 0;
  }
  else if (score <= 0.5) {
    return 1;
  }
  else {
    return 2;
  }
}