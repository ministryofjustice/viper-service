module.exports = (app) =>
  require('./environments/' + app.get('env'))(app.locals.config);
