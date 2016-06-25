require('./mobile-nav');
require('./newsletter');
var dom = require('./dom')(window.document);


transitionable();

function transitionable() {
  var body = dom.select('body')
  setTimeout(function() {
    body.classList.add('transitionable');
  }, 250)
}
