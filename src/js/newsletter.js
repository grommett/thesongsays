var dom = require('./dom')(window.document);
var compose = require('./lib').compose;
var prop = require('./lib').prop;
var identity = require('./lib').identity;
var jsonp = require('./jsonp');

// nodes
var form = cachedNode('#newsletter');
var email = cachedNode('#newsletter input');
var formBtn = cachedNode('#newsletter button');
var feedBackOk = cachedNode('.feedback.success');
var feedBackError = cachedNode('.feedback.error');

//Streams
var form$ = email().event('keyup');
var formBtn$ = formBtn().event('click');

// composed
var formURL = compose(attribute('action'), form);
var emailVarName = compose(attribute('name'), email);
var emailAddress = compose(prop('value'), email);
var emailValid = compose(checkEmail, emailAddress);
var enableSubmitBtn = compose(toggleBtnAttribute('disabled'), emailValid)

var getValidEmail = compose(getEmailAddress, emailValid)
var addSubscriber = compose(post(handlePostResponse), getValidEmail)

// Events/Streams
formBtn$.map(function(e) {
  e.preventDefault();
  addSubscriber()
})

form$.map(enableSubmitBtn);

// TODO: this srsly needs to get cleaned up
function handlePostResponse(response) {
    form().classList.add('hide')
    form().classList.remove('show')
    feedBackError().classList.remove('hide');
    if(response.Status === 200) {
      feedBackOk().classList.add('show')
    }else{
      feedBackError().classList.add('show');
      setTimeout(function(){
        form().classList.remove('hide')
        form().classList.add('show')
        feedBackError().classList.add('hide');
      }, 4000)
    }
}

function toggleClass(name) {
  return function(el) {
    if(el.classList.contains(name)) {
      el.classList.remove(name)
    }else{
      el.classList.add(name)
    }
  }
}

function getEmailAddress(bool) {
  if(bool === true) {
    return emailAddress();
  }
  return null;
}

function post(cb) {
  var endPoint = formURL();
  return function(data) {
    if(!data) return
    var subEndPoint = endPoint + '?' + emailVarName() + '=' + encodeURIComponent(data);
    jsonp(subEndPoint, cb)
  }
}

function toggleBtnAttribute(name) {
  var node = formBtn()
  return function(bool) {
    if(bool === true) node.removeAttribute(name)
    if(bool === false) node.setAttribute(name, name)
    return node
  }
}

function cachedNode(pattern) {
  var cached;
  return function() {
    if(cached) {
      return cached;
    }
    cached = dom.select(pattern);
    return cached;
  }
}

function attribute(name) {
  return function (el) {
    return el.getAttribute(name)
  }
};

function checkEmail(val) {
	var pattern = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return pattern.test(val);
};
