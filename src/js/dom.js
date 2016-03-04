function noop() {}

function dom(document) {
  var selected = {};
  return {
    select: function(pattern) {
      var s = document.querySelector(pattern);
      var n = (s) ? node(s) : node(null);
      return n;
    },
    node: node
  }
}

function node(n) {
  if(!n) return {map:noop,event:function(){return{map: noop}}};
  var el = n;

  el.event = function(type) {
    var eventFn;
    return {
      map: function(fn) {
        eventFn = fn;
        el.addEventListener(type, fn);
      },
      end: function() {
        el.removeEventListener(type, eventFn);
      }
    }
  }

  el.map = function(fn) {
    return fn(el)
  }

  el.toggleClass = function(name) {
    console.log('toggling ', name)
    if(el.classList.contains(name)) {
      el.classList.remove(name);
    }else{
      el.classList.add(name);
    }
  }

  return el;
}

module.exports = dom
