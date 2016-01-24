'use strict';

var through = require('through2');


module.exports = function(options){

  function data(file, enc, cb){

    var ignore = ['jpg', 'png', 'xml', 'gif', ''];
    var now = new Date();
    var fileExt = file.path.split('.').pop();

    if(ignore.indexOf(fileExt) !== -1) {
      console.log('\ndata ignoring: ', file.path + '\n')
      return cb(null, file);
    }

    if(file.isStream()){
      return cb(new Error('Streaming not supported'));
    }

    if(file.isBuffer()){
      try {
        var contents = String(file.contents);
        file.contents = new Buffer(contents);
      } catch(e) {
        return cb(new Error(e));
      }
    }
    retrun  cb(null, file);
  }

  return through.obj(timestampFile);
};
