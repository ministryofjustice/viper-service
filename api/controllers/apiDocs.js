const swaggerDoc = require('fs').readFileSync(require.resolve('../swagger/swagger.yaml'), 'utf8');
const yaml = require('node-yaml');

module.exports.apiDocs = (req, res, next) => {
  res.json(yaml.parse(swaggerDoc));
  next;
};
