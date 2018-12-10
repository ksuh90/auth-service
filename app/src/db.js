require('dotenv').config();
const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
bluebird.promisifyAll(redis.RedisClient.prototype);

module.exports = client;
