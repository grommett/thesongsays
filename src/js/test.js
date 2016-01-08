function newsItemMockView() {
  var panel = {
    height: 100,
    x: 0,
    y: 0
  }

  var mouseOverCallback;
  var mouseOutCallback;
  var active = false;

  return {
    active: function() { return active; },
    panel: panel,
    onMouseOver: function(callback) {
      mouseOverCallback = callback;
    },
    onMouseOut: function(callback) {
      mouseOutCallback = callback;
    },
    mouseOver: function() {
      mouseOverCallback(panel);
      active = true;
    },
    mouseOut: function() {
      mouseOutCallback(panel);
      active = false;
    }
  }
}

function newsItem(newsItemView) {
  var view = newsItemView;

  view.onMouseOver(handleRollOver);
  view.onMouseOut(handleRollOut);

  function handleRollOver(panel) {
    panel.y = panel.y - panel.height;
    console.log('rolledOver panel ', panel);
  }

  function handleRollOut(panel) {
    panel.y = panel.y + panel.height;
    console.log('rolledOut panel ', panel);
  }

  return {}
}

function newsLetterMockView() {
  var onChangeCallback;
  var value = '';
  var isValid = false;

  return {
    value: function() {return value},
    onChange: function(cb) {
      onChangeCallback = cb;
    },
    change: function(str) {
      value += str;
      onChangeCallback(value);
    },
    valid: function(bool) {
      if(bool === true || bool === false) {
        return isValid = bool;
      }
      return isValid;
    }
  }
}

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

module.exports = {
  newsItem: newsItem,
  newsItemView: newsItemMockView,
  newsLetter: newsLetter,
  newsLetterMockView: newsLetterMockView
}
