// Preprocess SASS to CSS in babel
// https://github.com/michalkvasnicak/babel-plugin-css-modules-transform#using-a-preprocessor
var sass = require('node-sass');

module.exports = function processSass (data, filename) {
  var result;

  result = sass.renderSync({
    data: data,
    file: filename
  }).css;
  return result.toString('utf8');
};
