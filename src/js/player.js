function player() {
  var scPlayer;
  var trackId;
  var node;
  var clientID = '16fc186177b1a1e6737cfe9599e70273';
  SC.initialize({client_id: clientID,useHTML5Audio: true});

  function playerLoaded(player) {
    scPlayer = player;
    scPlayer.on('finish', soundFinished)
    scPlayer.on('audio_error', function(e){console.log('There was an error getting audio: ', e);})
    scPlayer.play()
  }

  function soundFinished() {
    trackId = null;
    toggleTrack(node)
  }
  return {
    handle: function(el) {
      if(trackID(el) === trackId) return scPlayer.toggle()
      trackId = trackID(el)
      node = el;
      SC.stream('tracks/' + trackId).then(playerLoaded)
    }
  }
};
