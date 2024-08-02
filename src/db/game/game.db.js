import pools from '../database.js';
import { SQL_GAME_QUERIES } from './game.queries.js';
import { toCamelCase } from '../../utils/transformCase.js';

export const findMonstersByDungeonMonsters = async (dungeonId) => {
  const [rows] = await pools.TOWN_GAME.query(SQL_GAME_QUERIES.FIND_MONSTERS_BY_DUNGEON_MONSTERS, [
    dungeonId,
  ]);

  return toCamelCase(rows);
};

export const findMonsterByMonsters = async (monsterId) => {
  const [rows] = await pools.TOWN_GAME.query(SQL_GAME_QUERIES.FIND_MONSTER_BY_MONSTERS, [
    monsterId,
  ]);

  return toCamelCase(rows[0]);
};

export const getMonsterEffect = async (monsterId) => {
  const [rows] = await pools.TOWN_GAME.query(SQL_GAME_QUERIES.GET_MONSTER_EFFECT, [monsterId]);

  return toCamelCase(rows[0]).monsterEffect;
};

export const getLevelTable = async () => {
  const [rows] = await pools.TOWN_GAME.query(SQL_GAME_QUERIES.GET_LEVEL_TABLE, []);

  return toCamelCase(rows);
};

export const getDungeonItems = async (dungeonCode) => {
  const [rows] = await pools.TOWN_GAME.query(SQL_GAME_QUERIES.GET_DUNGEON_ITEMS, [dungeonCode]);

  return toCamelCase(rows);
};

export const getItem = async (itemId) => {
  const [rows] = await pools.TOWN_GAME.query(SQL_GAME_QUERIES.GET_ITEM, [itemId]);

  return toCamelCase(rows[0]);
};

export const getItemTable = async () => {
  const [rows] = await pools.TOWN_GAME.query(SQL_GAME_QUERIES.GET_ITEM_TABLE, []);

  return toCamelCase(rows);
};
