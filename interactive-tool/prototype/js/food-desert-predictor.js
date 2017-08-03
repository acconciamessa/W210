
function predictLikelihood(tract_id, feature_values, year) {
  /*
  Use a pretrained model to predict the likelihood that a given census tract is a food desert
  
  args: feature1 -
        feature2 - 
        feature3 - 
        feature4 -
        
  returns: 0, 1, or 2 corresponding to low, medium, or high food desert likelihood 
  */
  
  
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
  
  // TODO: implement function once predictive model is completed (return random value for now)
  return Math.floor(Math.random() * 3);
}