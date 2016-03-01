var dom = require('./dom')(window.document);
var trackEl = dom.select('.release-tracks');
var track$ = trackEl.event('click');
var trackTouch$ = trackEl.event('click');
var clickTarget = compose(until('LI'), prop('target'));
var toggleTrack = compose(toggleClass('playing'), prop('classList'));
var viewHandler = compose(toggle, clickTarget);
var handler = compose(playPauseTrack, viewHandler)

track$.map(handler);

function playPauseTrack(e) {
  if(trackID(e) === 'disabled') return
  var pattern = '[data-player-id="' + trackID(e) + '"]'
  var player = dom.select(pattern);

  player.onwaiting = function() {
      console.log("Buffering...");
  };

  player.onprogress = function(p) {
      console.log("Downloading video ", player.buffered.end(0), player.duration);
  };

  player.loadedmetadata = function(e) {
    console.log('track loadedmetadata');
  }

  player.onended = function(e) {
    console.log('track ended');
    player.pause()
    toggleTrack(e.target.parentNode)
  }

  player.oncanplay = function() {
    console.log('can play ' + pattern);
  }

  player.oncanplaythrough = function() {
    console.log('can play through' + pattern);
  }
  if(player.paused) return player.play()
  player.pause();
}

function toggle(e) {
  if(hasClass('disabled')(e.classList)) return e;
  var wasPlaying = dom.select('.track.playing');
  var playingAudio = dom.select('.track.playing audio');
  if(wasPlaying !== e && wasPlaying.classList) {
    if(!playingAudio.paused) {
      playingAudio.pause();
    }
    toggleTrack(wasPlaying);
  }
  toggleTrack(e);
  return e;
}

function trackID(e) {
  return e.getAttribute('data-track-id')
}

function compose(f, g) {
  return function(x) {
    return f(g(x))
  }
}

function prop(name) {
  return function(obj) {
    return obj[name]
  }
}

function hasClass(className) {
  return function(classList) {
    return classList.contains(className)
  }
}

function toggleClass(className) {
  return function(classList) {
    if(classList.contains(className)) {
      classList.remove(className)
    }else{
      classList.add(className)
    }
  }
}


function until(tagName) {
  return function(el) {
    if(el && el.tagName !== tagName) return until(tagName)(el.parentNode)
    return dom.node(el);
  }

}
