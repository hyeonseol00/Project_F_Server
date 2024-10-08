import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const HOST = process.env.HOST || 'localhost';
export const CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';

export const DB1_NAME = process.env.DB1_NAME || 'database1';
export const DB1_USER = process.env.DB1_USER || 'user1';
export const DB1_PASSWORD = process.env.DB1_PASSWORD || 'password1';
export const DB1_HOST = process.env.DB1_HOST || 'localhost';
export const DB1_PORT = process.env.DB1_PORT || 3306;

export const DB2_NAME = process.env.DB2_NAME || 'database1';
export const DB2_USER = process.env.DB2_USER || 'user1';
export const DB2_PASSWORD = process.env.DB2_PASSWORD || 'password1';
export const DB2_HOST = process.env.DB2_HOST || 'localhost';
export const DB2_PORT = process.env.DB2_PORT || 3306;

export const REDIS_HOST = process.env.REDIS_HOST || 'redis';
export const REDIS_PORT = process.env.REDIS_PORT || '10000';
export const REDIS_USERNAME = process.env.REDIS_USERNAME || 'default';
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || 'aaaa';

export const AWS_TABLE_NAME = process.env.AWS_TABLE_NAME;
export const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
export const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
export const REGION = process.env.REGION;

export const BULL_QUEUE_NAME = process.env.BULL_QUEUE_NAME;

export const CHANNEL_NUMBER = process.env.CHANNEL_NUMBER;
