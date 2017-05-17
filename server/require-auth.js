const basicAuth = require('basic-auth');

function unauthorized(res) {
  res.set('WWW-Authenticate', 'Basic realm=Password Required');
  return res.send(401);
}

module.exports = function requireAuth(username, password) {
  return function requireAuthentication(req, res, next) {
    const auth = basicAuth(req);
    if (!auth || !auth.name || !auth.pass) {
      return unauthorized(res);
    }

    if (auth.name !== username || auth.pass !== password) {
      return unauthorized(res);
    }

    return next();
  };
};
