require('chai').should();

const createDB = require('../server/db');
const mockKnex = require('mock-knex');

const log = require('../server/log');
log.streams = [];

global.createMockDB = function createMockDB() {
  const db = createDB();
  const tracker = mockKnex.getTracker();
  mockKnex.mock(db);

  return {db, tracker};
};
