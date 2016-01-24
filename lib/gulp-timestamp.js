'use strict';

var through = require('through2');

function template(file) {
  if(file.path.indexOf('html') !== -1) return '<!-- {} -->'
  return '/** {} **/'
}


module.exports = function(options){

  function timestampFile(file, enc, cb){

    var ignore = ['jpg', 'png', 'xml', 'gif', ''];
    var now = new Date();
    var fileExt = file.path.split('.').pop();

    if(ignore.indexOf(fileExt) !== -1) {
      console.log('\ntime stamp ignoring: ', file.path + '\n')
      return cb(null, file);
    }

    if(file.isStream()){
      return cb(new Error('Streaming not supported'));
    }

    if(file.isBuffer()){
      try {
        var contents = String(file.contents);
        var tpl = template(file)
        contents += '\n' + tpl.replace('{}', now.toUTCString())
        file.contents = new Buffer(contents);
        console.log(file.path);
      } catch(e) {
        return cb(new Error(e));
      }
    }
    return cb(null, file);
  }

  return through.obj(timestampFile);
};
