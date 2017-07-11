const yaml = require('js-yaml');

const swaggerDoc = require('fs').readFileSync(require.resolve('../swagger/swagger.yaml'), 'utf8');
const swaggerYaml = yaml.safeLoad(swaggerDoc);

module.exports.apiDocs = (req, res, next) => {
  res.json(swaggerYaml);
  next;
};
