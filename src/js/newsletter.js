var dom = require('./dom')(window.document);
var qwest = require('../../node_modules/qwest/qwest.min.js');
var email = dom.select('#newsletter input');
var formBtn = dom.select('#newsletter button');
var form$ = email.event('keyup')
var formBtn$ = formBtn.event('click')

formBtn$.map(function(e) {
  e.preventDefault();
  console.log('submitting form!');
})
form$.map(function(e) {
  console.log('valid ', checkEmail(e.target.value));
})
console.log('form stream ',form$);
console.log('email stream ', email);

function newsLetter(view) {
  view.onChange(validateEmail);

  function validateEmail(val) {
    console.log('checking email ', checkEmail(val))
    view.valid(checkEmail(val))
  }
}

function checkEmail(val) {
	var pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return pattern.test(val);
}

function compose(f,g) {
  return function(x) {
    return f(g(x));
  }
}
