const yaml = require('js-yaml');
const apiDocsController = require('../api/controllers/apiDocs');

const swaggerYaml = require('fs').readFileSync(require.resolve('../api/swagger/swagger.yaml'), 'utf8');
const swaggerObject = yaml.safeLoad(swaggerYaml);
const swaggerUi = require('swagger-ui-express');

module.exports = (app) => {
  app.get('/api-docs', apiDocsController.apiDocs);
  app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerObject));
};
