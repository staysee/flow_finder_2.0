'use strict'

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/flow-finder-2';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-flow-finder-2';
exports.PORT = process.env.PORT || 8080;