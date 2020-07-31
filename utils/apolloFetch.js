const apollo = require('apollo-fetch');

const apolloFetch = apollo.createApolloFetch({
  uri: 'https://api.github.com/graphql',
});

const setAuthorizationHeader = (token) => {
  apolloFetch.use(({
    _,
    options
  }, next) => {
    if (!options.headers) {
      options.headers = {};
    }
    options.headers.Authorization = `Bearer ${token}`;
    next();
  });
};

module.exports = {
  apolloFetch,
  setAuthorizationHeader
};