require('./mobile-nav');
require('./newsletter');
require('./vimeo-player');
var dom = require('./dom')(window.document);


transitionable();

function transitionable() {
  var body = dom.select('body')
  setTimeout(function() {
    body.classList.add('transitionable');
  }, 250)
}
