import pools from '../database.js';
import { SQL_GAME_QUERIES } from './game.queries.js';
import { toCamelCase } from '../../utils/transformCase.js';

export const findMonstersByDungeonMonsters = async (dungeonId) => {
  const [rows] = await pools.TOWN_GAME.query(SQL_GAME_QUERIES.FIND_MONSTERS_BY_DUNGEON_MONSTERS, [
    dungeonId,
  ]);

  return toCamelCase(rows);
};

export const findMonsterById = async (monsterId) => {
  const [rows] = await pools.TOWN_GAME.query(SQL_GAME_QUERIES.FIND_MONSTER_BY_ID, [monsterId]);

  return toCamelCase(rows[0]);
};
//getMonsterEffectByIdById
export const getMonsterEffectById = async (monsterId) => {
  const [rows] = await pools.TOWN_GAME.query(SQL_GAME_QUERIES.GET_MONSTER_EFFECT_BY_ID, [
    monsterId,
  ]);

  return toCamelCase(rows[0]).monsterEffect;
};

export const getAllLevelData = async () => {
  const [rows] = await pools.TOWN_GAME.query(SQL_GAME_QUERIES.GET_ALL_LEVEL_DATA, []);

  return toCamelCase(rows);
};

export const getDungeonItems = async () => {
  const [rows] = await pools.TOWN_GAME.query(SQL_GAME_QUERIES.GET_DUNGEON_ITEMS, []);

  return toCamelCase(rows);
};

export const getAllItemData = async () => {
  const [rows] = await pools.TOWN_GAME.query(SQL_GAME_QUERIES.GET_ALL_ITEM_DATA, []);

  return toCamelCase(rows);
};

export const getMonster = async () => {
  const [rows] = await pools.TOWN_GAME.query(SQL_GAME_QUERIES.GET_MONSTER, []);

  return toCamelCase(rows);
};

export const getDungeonMonster = async () => {
  const [rows] = await pools.TOWN_GAME.query(SQL_GAME_QUERIES.GET_DUNGEON_MONSTER, []);

  return toCamelCase(rows);
};

// 퀘스트 정보를 가져오는 함수
export const findQuestById = async (questId) => {
  const [rows] = await pools.TOWN_GAME.query(SQL_QUEST_QUERIES.FIND_QUEST_BY_ID, [questId]);
  return toCamelCase(rows[0]);
};

// 모든 퀘스트 정보를 가져오는 함수
export const getAllQuests = async () => {
  const [rows] = await pools.TOWN_GAME.query(SQL_QUEST_QUERIES.GET_ALL_QUESTS, []);
  return toCamelCase(rows);
};

// 새로운 퀘스트를 추가하는 함수
export const addQuest = async (
  questName,
  questDescription,
  questLevel,
  monsterCount,
  rewardExp,
  rewardGold,
) => {
  const [result] = await pools.TOWN_GAME.query(SQL_QUEST_QUERIES.ADD_QUEST, [
    questName,
    questDescription,
    questLevel,
    monsterCount,
    rewardExp,
    rewardGold,
  ]);
  return result.insertId;
};

// 유저 퀘스트 진행 상황을 업데이트하는 함수
export const updateQuestProgress = async (userId, questId, progress, status) => {
  await pools.TOWN_MONSTER.query(SQL_QUEST_QUERIES.UPDATE_QUEST_PROGRESS, [
    progress,
    status,
    userId,
    questId,
  ]);
};

// 유저의 모든 퀘스트를 가져오는 함수
export const getUserQuests = async (userId) => {
  const [rows] = await pools.TOWN_MONSTER.query(SQL_QUEST_QUERIES.GET_USER_QUESTS, [userId]);
  return toCamelCase(rows);
};

// 새로운 유저 퀘스트를 추가하는 함수
export const addUserQuest = async (userId, questId, progress = 0, status = 'NOT_STARTED') => {
  await pools.TOWN_MONSTER.query(SQL_QUEST_QUERIES.ADD_USER_QUEST, [
    userId,
    questId,
    progress,
    status,
  ]);
};
