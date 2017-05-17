function unauthorized(res) {
  res.set('WWW-Authenticate', 'Basic realm=Password Required');
  return res.send(401);
}

module.exports =
  (username, password) =>
    (req, res, next) => {
      var auth = req.authorization.basic;

      if (!auth || !auth.username || auth.username !== username || !auth.password || auth.password !== password) {
        return unauthorized(res);
      }

      next();
    };
