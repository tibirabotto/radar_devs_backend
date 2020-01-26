module.exports = function parseStringAsArray(arrayAsString)  {
  if (arrayAsString) {
    return arrayAsString.split(',').map(x => x.trim()) 
  } 
  
  return null
}