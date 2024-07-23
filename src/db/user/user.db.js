import pools from '../database.js';
import { SQL_QUERIES } from './user.queries.js';
import { toCamelCase } from '../../utils/transformCase.js';

export const findUserByUsername = async (username) => {
  const [rows] = await pools.TOWN_MONSTER.query(SQL_QUERIES.FIND_USER_BY_USERNAME, [username]);

  return toCamelCase(rows[0]);
};

export const insertUserByUsername = async (username) => {
  await pools.TOWN_MONSTER.query(SQL_QUERIES.INSERT_USER, [username]);
};

export const findCharacterByUserIdAndClass = async (userId, jobId) => {
  const [rows] = await pools.TOWN_MONSTER.query(SQL_QUERIES.FIND_CHARACTER_BY_USER_ID_AND_CLASS, [
    userId,
    jobId,
  ]);

  return toCamelCase(rows[0]);
};

export const insertCharacter = async (user, jobId) => {
  const { jobName, baseHp, baseMp, baseAttack, baseDefense, baseMagic, baseSpeed } =
    await getJobInfo(jobId);

  await pools.TOWN_MONSTER.query(SQL_QUERIES.INSERT_CHARACTER, [
    user.userId,
    user.username,
    jobId,
    jobName,
    baseHp,
    baseMp,
    baseHp,
    baseMp,
    baseAttack,
    baseDefense,
    baseMagic,
    baseSpeed,
  ]);
};

export const getJobInfo = async (jobId) => {
  const [rows] = await pools.TOWN_MONSTER.query(SQL_QUERIES.GET_JOB_INFO, [jobId]);

  return toCamelCase(rows[0]);
};
