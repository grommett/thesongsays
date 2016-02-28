function getReleasesByArtist(artist, releases) {
  var found = releases.filter(function(release) {
    return release.artist == artist
  }).sort(function(a,b) {
    return a.date < b.date
  })
  return found;
}

function getArtist(artist, artistsData) {
  var found = artistsData.filter(function(artistItem) {
    return artistItem.name === artist
  })
  return found;
}

function getRelease(release, releaseData) {
  var found = releaseData.filter(function(releaseItem) {
    return releaseItem.title === release
  });
  return found;
}

function sortByDate(arr) {
  var found = arr.sort(function(a,b) {
    var aDate = new Date(a.date);
    var bDate = new Date(b.date);
    console.log('comparing ', aDate, ' to ', bDate);
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

module.exports = {
  getArtists: getArtists,
  getArtist: getArtist,
  getReleasesByArtist: getReleasesByArtist,
  getRelease: getRelease,
  getTracks: getTracks,
  sortByProp: sortByProp,
  sortByDate: sortByDate
}
