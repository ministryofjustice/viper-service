'use strict';

/**
 * Amended version of swagger_raw from swagger-node-runner
 */

var debug = require('debug')('pipes:fittings');
var YAML = require('js-yaml');
var _ = require('lodash');

// default filter just drops all the x- labels
var DROP_SWAGGER_EXTENSIONS = /^(?!x-.*)/;

module.exports = function create(fittingDef, bagpipes) {

  var filter = DROP_SWAGGER_EXTENSIONS;
  if (fittingDef.filter) {
    filter = new RegExp(fittingDef.filter);
  }
  debug('swagger doc filter: %s', filter);
  var filteredSwagger = filterKeysRecursive(bagpipes.config.swaggerNodeRunner.swagger, filter);

  return function fitting(context, next) {

    var req = context.request;

    const definition = _.defaults({
      host: req.headers['host'],
      schemes: [req.isSecure() ? 'https' : 'http']
    }, filteredSwagger);

    var accept = req.headers['accept'];
    if (accept && accept.indexOf('yaml') !== -1) {
      context.headers['Content-Type'] = 'application/yaml';
      next(null, YAML.safeDump(definition, { indent: 2 }));
    } else {
      context.headers['Content-Type'] = 'application/json';
      next(null, JSON.stringify(definition, null, 2));
    }
  };
};

function filterKeysRecursive(object, regex) {
  if (_.isPlainObject(object)) {
    var result = {};
    _.each(object, function(value, key) {
      if (regex.test(key)) {
        result[key] = filterKeysRecursive(value, regex);
      }
    });
    return result;
  }
  return object;
}
