var dom = require('./dom')(window.document);
var iframe = dom.select('.video-vimeo');
var videoClickEl = dom.select('.video-vimeo-click-target');
var videoOverlayEl = dom.select('.video-overlay');
var videoClick$ = videoClickEl.event('click');

try {
  var player = new Vimeo.Player(iframe);
  videoClick$.map(toggle(player, videoOverlayEl));
}catch(e){
  console.warn('Vimeo not on page')
}


function toggle(player, overlay) {
 var playing = false;
 return function() {
   playing = !playing;
   if(playing) player.play();
   if(!playing) player.pause();
   overlay.toggleClass('hide')
 }
}

function onPlayProgress(e) {
 console.log('progress ', e.percent);
}
