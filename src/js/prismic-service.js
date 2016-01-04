var Prismic = require('prismic.io').Prismic;
var q = require('q');
var api;

function prisimicApi() {
  if(api) {
    return q.when(api);
  }

  var deferred = q.defer();
  Prismic.Api('https://thesongsays.prismic.io/api', function (err, prisApi) {
    if(err) {
      deferred.reject(err)
    }else{
      api = prisApi;
      deferred.resolve(api);
    }
  })
  return deferred.promise;
}


function posts() {
  var deferred = q.defer();
  prisimicApi()
    .then(getPosts)
    .then(deferred.resolve)
    .catch(function(err) {
      q.reject(err);
    })
  return deferred.promise;
}

function authors() {
  var deferred = q.defer();
  prisimicApi()
    .then(getAuthors)
    .then(deferred.resolve)
    .catch(function(err) {
      q.reject(err);
    })
  return deferred.promise;
}

function getPosts(api) {
  var deferred = q.defer();

  api.form('posts')
  .ref(api.master())
  .orderings('[my.post.date desc]')
  .submit(function(err, response) {
    if (err) return deferred.reject(err);
    deferred.resolve(response.results);
  });
  return deferred.promise;
}

function getAuthors(api) {
  var deferred = q.defer();

  api.form('authors')
  .ref(api.master())
  .submit(function(err, response) {
    if (err) return deferred.reject(err);
    deferred.resolve(response.results);
  });
  return deferred.promise;
}

module.exports = {
  posts: posts,
  authors: authors
}
