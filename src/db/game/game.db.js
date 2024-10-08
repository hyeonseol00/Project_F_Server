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

export const getQuests = async () => {
  const [rows] = await pools.TOWN_GAME.query(SQL_GAME_QUERIES.GET_ALL_QUESTS, []);
  return toCamelCase(rows);
};

export const getQuestsByLevel = async (level) => {
  const [rows] = await pools.TOWN_GAME.query(SQL_GAME_QUERIES.GET_QUESTS_BY_LEVEL, [level]);
  return rows;
};
