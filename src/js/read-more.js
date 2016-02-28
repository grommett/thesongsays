var dom = require('./dom')(window.document);
var readMoreBtn = dom.select('.button.read-more');
var readMoreTxt = dom.select('.text-more');
var readMoreBtn$ = readMoreBtn.event('click');
var readMoreTxt$ = readMoreTxt.event('transitionend');

readMoreBtn$.map(clickHandler);
readMoreTxt$.map(function(e) {
  if(e.propertyName === 'height') {
    readMoreTxt.style.transition = 'none';
    readMoreTxt.style.height = 'auto';
    console.log('transition ended: ' , e)
  }else{
    console.log('transition ended: ' , e)
  }
});

function clickHandler(ev) {
  var height = readMoreTxt.offsetHeight;
  readMoreTxt.style.height = 0;
  readMoreTxt.style.position = "relative";
  readMoreBtn.style.display = "none";
  setTimeout(function(){
    readMoreTxt.style.opacity = 1
    readMoreTxt.style.height = height+'px';
  }, 20);
};
