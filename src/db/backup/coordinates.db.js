import { v4 as uuidv4 } from 'uuid';
import pools from '../database.js';
import { SQL_QUERIES } from './coordinates.queries.js';
import { toCamelCase } from '../../utils/transformCase.js';

export const findUserByDeviceID = async (deviceId) => {
  const [rows] = await pools.USER_COORDINATES.query(SQL_QUERIES.FIND_USER_BY_DEVICE_ID, [deviceId]);

  return toCamelCase(rows[0]);
};

export const createUserbackupCoordinate = async (deviceId) => {
  const id = uuidv4();

  await pools.USER_COORDINATES.query(SQL_QUERIES.BACKUP_COORDINATE, [id, deviceId, 0, 0]);

  return { id, deviceId, x: 0, y: 0 };
};

export const updateUserBackupCoordinate = async (id, x, y) => {
  await pools.USER_COORDINATES.query(SQL_QUERIES.UPDATE_COORDINATE, [x, y, id]);
};
