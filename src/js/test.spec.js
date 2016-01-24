var assert = require('assert');
var news = require('./test');


describe('newsItem', function(done) {
  it('should move its panel up when rolled over', function() {
    var newsItemView = news.newsItemView();
    var newsItem = news.newsItem(newsItemView);
    newsItemView.mouseOver();
    assert.equal(newsItemView.panel.y, -100);
    assert.equal(newsItemView.active(), true);
  })
  it('should move its panel down when rolled out', function() {
    var newsItemView = news.newsItemView();
    var newsItem = news.newsItem(newsItemView);
    newsItemView.mouseOver();
    newsItemView.mouseOut();
    assert.equal(newsItemView.panel.y, 0);
    assert.equal(newsItemView.active(), false);
  })
})

describe('news letter', function(done) {
  it('should validate the value entered', function() {
    var newsLetterView = news.newsLetterMockView();
    var newsLetter = news.newsLetter(newsLetterView);
    newsLetterView.change('david@pinkiering.com');
    assert.equal(newsLetterView.valid(), true);
  });
  it('should validate to false when bad email entered', function() {
    var newsLetterView = news.newsLetterMockView();
    var newsLetter = news.newsLetter(newsLetterView);
    newsLetterView.change('davidpinkiering.com');
    assert.equal(newsLetterView.valid(), false);
  })
})

describe.skip('test spec', function(done) {
  it('should do something', function() {
    var t = $('.overlay h2');
    assert(t, 'Bruno Pronsato');
  })
})

describe.skip('test tabletop', function(done) {
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
});
