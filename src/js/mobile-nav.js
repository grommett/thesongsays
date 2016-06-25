var dom = require('./dom')(window.document)
var closeBtn = dom.select('.mobile-nav-close-btn');
var openBtn = dom.select('.mobile-nav-open-btn');
var mobileNav = dom.select('.mobile-nav');
var closeBtn$ = closeBtn.event('click');
var openBtn$ = openBtn.event('click');

closeBtn$.map(toggleClass('open'));
openBtn$.map(toggleClass('open'));

function toggleClass(name) {
  return function() {
    if(mobileNav.classList.contains(name)) {
      mobileNav.classList.remove(name);
    }else{
      mobileNav.classList.add(name);
    }
  }
}
