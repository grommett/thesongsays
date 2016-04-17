function getReleasesByArtist(artist, releases) {
  var found = releases.filter(function(release) {
    return release.artist == artist
  });

  return sortByDate(found);
}

function getArtist(artist, artistsData) {
  var found = artistsData.filter(function(artistItem) {
    return artistItem.name === artist
  })
  return found;
}

function releaseCaption(release) {
  if(!release.meta) return ''
  if(!release.meta.releaseCaption) return ''
  return release.meta.releaseCaption;
}

function getRelease(release, releaseData) {
  var found = releaseData.filter(function(releaseItem) {
    return releaseItem.title === release
  });
  return found;
}

function getReleaseById(id, releaseData) {
  var found = releaseData.filter(function(releaseItem) {
    return releaseItem.id === id
  });
  return found;
}

function sortByDate(arr) {
  var found = arr.sort(function(a,b) {
    var aDate = new Date(a.date);
    var bDate = new Date(b.date);
    if(aDate < bDate) return 1
    if(aDate > bDate) return -1
    return 0;
  })
  return found;
}

function sortByProp(arr, prop) {
  var found = arr.sort(function(a,b) {
    if(a[prop] < b[prop]) return 1
    if(a[prop] > b[prop]) return -1
    return 0;
  })
  return found;
}

function getArtists(artists) {
  var found = artists.sort(function(a,b) {
    if(a.name > b.name) return 1
    if(a.name < b.name) return -1
    return 0
  })
  return found;
}

function getTracks(artistRelease, releases) {

  var found = releases.filter(function(release) {
    return release.title === artistRelease
  })
  return found[0].tracks;
}

function getPress(artist, press) {
  var found = press.filter(function(artists) {
    return artists.artist === artist
  })

  return found[0].press || [];
}

module.exports = {
  getArtists: getArtists,
  getArtist: getArtist,
  getReleasesByArtist: getReleasesByArtist,
  getRelease: getRelease,
  getReleaseById: getReleaseById,
  releaseCaption: releaseCaption,
  getTracks: getTracks,
  sortByProp: sortByProp,
  sortByDate: sortByDate,
  getPress: getPress
}
