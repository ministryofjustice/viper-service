require('chai').should();

const createDB = require('../server/db');
const mockKnex = require('mock-knex');

const log = require('../server/log');
log.streams = [];

let db;
global.createMockDB = function createMockDB() {
  db = db || createDB();
  if (!mockKnex.isMocked(db)) {
    mockKnex.mock(db);
  }
  return {db, tracker: mockKnex.getTracker()};
};
global.createRealDB = function getUnmockedDB() {
  db = db || createDB();
  if (mockKnex.isMocked(db)) {
    mockKnex.unmock(db);
  }
  return db;
}