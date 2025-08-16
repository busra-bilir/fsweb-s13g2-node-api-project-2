const db = require('./db-config');

module.exports = {
  find: () => db('posts')
};