import pools from '../database.js';
import { SQL_QUERIES, SQL_QUEST_QUERIES } from './user.queries.js';
import { toCamelCase } from '../../utils/transformCase.js';

export const findUserByUsername = async (username) => {
  const [rows] = await pools.TOWN_MONSTER.query(SQL_QUERIES.FIND_USER_BY_USERNAME, [username]);

  return toCamelCase(rows[0]);
};

export const insertUser = async (username, password) => {
  await pools.TOWN_MONSTER.query(SQL_QUERIES.REGISTER_USER, [username, password]);
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
  const {
    jobName,
    baseHp,
    baseMp,
    baseAttack,
    baseDefense,
    baseMagic,
    baseSpeed,
    baseCritical,
    baseCriticalAttack,
    baseAvoidAbility,
  } = await getJobInfo(jobId);

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
    baseCritical,
    baseCriticalAttack,
    baseAvoidAbility,
  ]);
};

export const getJobInfo = async (jobId) => {
  const [rows] = await pools.TOWN_MONSTER.query(SQL_QUERIES.GET_JOB_INFO, [jobId]);

  return toCamelCase(rows[0]);
};

export const findJobById = async (jobId) => {
  const [rows] = await pools.TOWN_MONSTER.query(SQL_QUERIES.FIND_JOB_BY_ID, [jobId]);

  return toCamelCase(rows[0]);
};

export const getCharacterBaseEffectCode = async (jobId) => {
  const [rows] = await pools.TOWN_MONSTER.query(SQL_QUERIES.GET_CHARACTER_BASE_EFFECT_CODE, [
    jobId,
  ]);

  return toCamelCase(rows[0]).baseEffect;
};

export const getCharacterSingleEffectCode = async (jobId) => {
  const [rows] = await pools.TOWN_MONSTER.query(SQL_QUERIES.GET_CHARACTER_SINGLE_EFFECT_CODE, [
    jobId,
  ]);

  return toCamelCase(rows[0]).singleEffect;
};

export const getCharacterWideEffectCode = async (jobId) => {
  const [rows] = await pools.TOWN_MONSTER.query(SQL_QUERIES.GET_CHARACTER_WIDE_EFFECT_CODE, [
    jobId,
  ]);

  return toCamelCase(rows[0]).wideEffect;
};

export const updateCharacterStatus = async (user) => {
  const statInfo = user.playerInfo.statInfo;
  const { level, hp, maxHp, mp, maxMp, atk, speed, critRate, critDmg, avoidRate, exp, def, magic } =
    statInfo;

  const { nickname, characterClass, gold, worldLevel, skillPoint } = user;
  const { weapon, armor, gloves, shoes, accessory } = user.equipment;

  await pools.TOWN_MONSTER.query(SQL_QUERIES.UPDATE_CHARACTER_STATUS, [
    level,
    exp,
    hp,
    maxHp,
    mp,
    maxMp,
    atk,
    def,
    magic,
    speed,
    critRate,
    critDmg,
    avoidRate,
    gold,
    worldLevel,
    skillPoint,
    weapon,
    armor,
    gloves,
    shoes,
    accessory,
    nickname,
    characterClass,
  ]);
};

export const getUserQuests = async (characterId) => {
  const [rows] = await pools.TOWN_MONSTER.query(SQL_QUEST_QUERIES.GET_USER_QUESTS, [characterId]);
  return toCamelCase(rows);
};

export const addUserQuest = async (characterId, questId, killCount = 0, status = 'NOT_STARTED') => {
  const [existingQuest] = await pools.TOWN_MONSTER.query(
    `SELECT * FROM user_quests WHERE character_id = ? AND quest_id = ?`,
    [characterId, questId],
  );

  if (existingQuest.length > 0) {
    console.log(`유저 ${characterId}는 이미 퀘스트 ${questId}를 가지고 있습니다.`);
    return false;
  }

  await pools.TOWN_MONSTER.query(SQL_QUEST_QUERIES.ADD_USER_QUEST, [
    characterId,
    questId,
    killCount,
    status,
  ]);
};

export const updateQuestProgress = async (characterId, questId, killCount, status) => {
  await pools.TOWN_MONSTER.query(SQL_QUEST_QUERIES.UPDATE_QUEST_PROGRESS, [
    killCount,
    status,
    characterId,
    questId,
  ]);
};

export const removeUserQuest = async (characterId, questId) => {
  await pools.TOWN_MONSTER.query(SQL_QUEST_QUERIES.REMOVE_USER_QUEST, [characterId, questId]);
};
