'use strict';

var through = require('through2');
var cloudfrontURL = 'http://d1y0ezh3fklawp.cloudfront.net/'

module.exports = function(options){

  function removeNavClasses(inStr) {
    var str = inStr.replace(/class=\"\!\{.*?\}\"/g, '');
    return str;
  }

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
        if(file.path.indexOf('/artists/') !== -1 ) contents = contents.replace('class="!{artists}"', 'class="active"')
        if(file.path.indexOf('/blog/') !== -1 ) contents = contents.replace('!{blog}', 'active')
        if(file.path.indexOf('/releases/') !== -1 ) contents = contents.replace('class="!{releases}"', 'class="active"')
        if(file.path.indexOf('/info/') !== -1 ) contents = contents.replace('class="!{info}"', 'class="active"')
        contents = removeNavClasses(contents);

        file.contents = new Buffer(contents);
      } catch(e) {
        return cb(new Error(e));
      }
    }
    return cb(null, file);
  }

  return through.obj(cloudFront);
};
