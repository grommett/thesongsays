'use strict';

var through = require('through2');
var cloudfrontURL = 'http://d1y0ezh3fklawp.cloudfront.net/'

module.exports = function(options){

  function cloudFront(file, enc, cb){

    // only do this to html files
    if(file.path.indexOf('.html') === -1) {
      return cb(null, file);
    }

    if(file.isStream()){
      return cb(new Error('Streaming not supported'));
    }

    if(file.isBuffer()){
      try {
        var contents = String(file.contents);
        contents = contents.replace(/="\/imgs/g, '="' + cloudfrontURL + 'imgs');
        contents = contents.replace(/src="(\/js|js)/g, 'src="'+ cloudfrontURL + 'js');
        contents = contents.replace(/href="\/css/g, 'href="'+ cloudfrontURL + 'css');
        file.contents = new Buffer(contents);
      } catch(e) {
        return cb(new Error(e));
      }
    }
    return cb(null, file);
  }

  return through.obj(cloudFront);
};
