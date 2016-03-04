var dom = require('./dom')(window.document)
var closeBtn = dom.select('.mobile-nav-close-btn');
var openBtn = dom.select('.mobile-nav-open-btn');
var mobileNav = dom.select('.mobile-nav');
var body = dom.select('body');
var closeBtn$ = closeBtn.event('click');
var openBtn$ = openBtn.event('click');

closeBtn$.map(closeBtnClick)
openBtn$.map(openBtnClick)


function closeBtnClick(e) {
  mobileNav.classList.remove('open');
  body.classList.remove('no-scroll');

}

function openBtnClick(e) {
  mobileNav.classList.add('open');
  body.classList.add('no-scroll');
}
