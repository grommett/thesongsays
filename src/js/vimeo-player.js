var dom = require('./dom')(window.document);
var domContext = require('./dom');
var iframe = dom.select('.video-vimeo');
var iframes = dom.selectAll('.video-vimeo');

iframes.forEach(enableVideo);

function enableVideo(iframe, index) {
  var ctx = domContext(iframe.parentNode);
  var player = new Vimeo.Player(iframe);
  var videoClickEl = ctx.select('.video-vimeo-click-target');
  var videoOverlayEl = ctx.select('.video-overlay');
  var videoClick$ = videoClickEl.event('click');
  var overlayToggle = toggleOverlay(videoOverlayEl);

  player.on('play', overlayToggle);
  player.on('pause', overlayToggle);
  videoClick$.map(toggle(player));
}

function toggleOverlay(overlay) {
  return function() {
    overlay.toggleClass('hide');
  }
}

function toggle(player) {
 return function() {
   player.getPaused()
   .then(function(paused) {
     if(paused) return player.play();
     if(!paused) return player.pause();
   })
   .catch(function(error) {
     console.error('Error setting play state on video ', error);
   })
 };
}
