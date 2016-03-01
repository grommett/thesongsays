function compose(f, g) {
  return function(x) {
    return f(g(x));
  }
}

function prop(name) {
  return function(obj) {
    return obj[name];
  }
}

function identity(x) {
  return x
}

module.exports = {
  compose: compose,
  prop: prop,
  identity: identity
}
