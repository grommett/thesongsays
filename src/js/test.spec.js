var assert = require('assert');
var fs = require('fs');
var file = fs.readFileSync('./tmp/index.html');
var cheerio = require('cheerio');
var $ = cheerio.load(file);
var Tabletop = require('tabletop');
var Prismic = require('prismic.io').Prismic;
var jade = require('jade');

console.log(__dirname);
var service = require('./prismic-service');





describe('test spec', function(done) {
  it('should do something', function() {
    var t = $('.overlay h2');
    assert(t, 'Bruno Pronsato');
  })
})

describe('test tabletop', function(done) {
  this.timeout(10000);
  it('should get data', function(done) {
    var tabletop = Tabletop.init({
      key: '1EIBZwUKUe7UBepBovhykPY5y1_pX4FBFHp-oQpuGjoA',
      callback: showInfo
    });

    function showInfo(d) {
      var sheet = tabletop.sheets('Videos').all();
      sheet.forEach(function(track) {
        console.log('*** ' + track.Artist);
      })
      done();
    }
  })
})


describe.skip('Prismic Posts', function() {
  this.timeout(10000);
  it('should get all the posts', function(done) {
    service.posts()
    .then(function(d) {
      console.log('got prismic data ', d);
      done();
    })
    .catch(function(err) {
      console.log('Got an err ', err);
      done();
    })
  })
})

describe.skip('Prismic Authors', function() {
  this.timeout(10000);
  it('should get all the authors', function(done) {
    service.authors()
    .then(function(d) {
      console.log('got prismic data ', d);
      done();
    })
    .catch(function(err) {
      console.log('Got an err ', err);
      done();
    })
  })
})

describe('Prismic Blog', function() {
  this.timeout(10000);
  var obj = {};
  it('should get all Post and Authors', function(done) {
    service.posts()
    .then(function(d) {
      obj = d;
      return d
    })
    .then(service.authors)
    .then(function(authors) {
      obj.posts.forEach(function(post) {
        post.author = authors[post.author]
      })
      console.log(JSON.stringify(obj));
      done();
    })
    .catch(function(err) {
      console.log('Got an err ', err);
      done();
    })
  })
})
