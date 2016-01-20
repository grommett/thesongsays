'use strict';
var through = require('through2');
var jade = require('jade');
var service = require('../src/js/prismic-service');
var q = require('q');
var File = require('vinyl');

function posts() {
  var deferred = q.defer();
  var obj = {};

  service.posts()
  .then(function(d) {
    obj.posts = d;
  })
  .then(service.authors)
  .then(function(authors) {
    obj.authors = authors;
    deferred.resolve(obj);
  })
  .catch(function(err) {
    console.log('Error: ', err);
  })

  return deferred.promise;
}

function getPostAuthor(id, authors) {
  var author = authors.filter(function(a){
    return a.id === id;
  })
  console.log('ID: ', id, ' Author: ', author[0].getText('author.name'));
  return author[0];
}

// Vinly File Factory
function getVfile(file, post, content) {
  var fileName = file.path.split('/').pop();
  console.log(fileName);
  return new File({
    cwd: file.cwd,
    base: file.base,
    path: file.path.replace(fileName, post.slug) + '/index.html',
    contents: new Buffer(content)
  });
}

function index(data, file, opts, through) {
  var compiled;
  var contents = String(file.contents);
  compiled = jade.compile(contents, opts)({posts:data.posts});
  console.log(compiled);
  file.contents = new Buffer(compiled);
  file.path = file.path.replace('.jade', '.html')
  through.push(file);
}

function post(data, file, opts, through) {
  var contents = String(file.contents);
  var compiled;
  var vFile;

  data.posts.forEach(function(post) {
    try {
      var author = getPostAuthor(post.get('post.author').id, data.authors);
      compiled = jade.compile(contents, opts)({post:post, author:author});
      vFile = getVfile(file, post, compiled);
      through.push(vFile);
    }catch(e) {
      console.log('Error: ', e);
    }
  })
}

module.exports = function(options){

  function blog(file, enc, cb){
    if(file.isBuffer()){
      try {
        var opts = {filename: file.path, pretty: options.pretty || false};
        var self = this;
        var vFile;

        posts()
        .then(function(data) {
          if(file.path.indexOf('post.jade') !== -1) post(data, file, opts, self);
          if(file.path.indexOf('index.jade') !== -1) index(data, file, opts, self);
          return cb();
        })
      } catch(e) {
        return cb(new Error(e));
      }
    }
  }

  return through.obj(blog);
};
