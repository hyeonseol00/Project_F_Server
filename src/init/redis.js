import { config } from '../config/config.js';
import redis from 'redis';

export const redisClient = redis.createClient({
  url: `redis://${config.redis.username}:${config.redis.password}@${config.redis.host}:${config.redis.port}/0`,
  legacyMode: true,
});

redisClient.on('connect', () => {
  console.info('Redis connected');
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.connect().then();

export const redisCli = redisClient.v4;
