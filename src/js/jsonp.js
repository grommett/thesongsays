/*
 * Couldn't find a better way with Campaign monitor
 * Code from:
 * http://stackoverflow.com/questions/22780430/javascript-xmlhttprequest-using-jsonp
*/

function jsonp(url, callback) {
  var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());

  window[callbackName] = function(data) {
      delete window[callbackName];
      document.body.removeChild(script);
      callback(data);
  };

  var script = document.createElement('script');
  var source = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
  script.src = source;
  document.body.appendChild(script);
}

module.exports = jsonp
