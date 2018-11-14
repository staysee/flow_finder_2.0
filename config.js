'use strict'

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/flow-finder-2';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/test-flow-finder-2';
exports.PORT = process.env.PORT || 8080;

exports.JWT_SECRET = process.env.JWT_SECRET || 'secret';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';	//expires in 7 days
