import { toCamelCase } from '../../../utils/transformCase.js';
import pools from '../../database.js';
import { SQL_QUERIES } from './items.queries.js';

export const getUserItemsByCharacterId = async (characterId) => {
  const [rows] = await pools.TOWN_MONSTER.query(SQL_QUERIES.GET_USER_ITEMS_BY_CHARACTER_ID, [
    characterId,
  ]);

  return toCamelCase(rows);
};

export const existItem = async (characterId, itemId) => {
  const [rows] = await pools.TOWN_MONSTER.query(SQL_QUERIES.IS_EXIST_ITEM, [characterId, itemId]);

  if (rows.length) return true;
  return false;
};

export const updateCharacterItems = async (characterId, items) => {
  for (const item of items) {
    if (await existItem(characterId, item.itemId)) {
      // item 목록이 있다면
      if (item.quantity === 0) {
        await pools.TOWN_MONSTER.query(SQL_QUERIES.DELETE_CHARACTER_ITEM, [
          characterId,
          item.itemId,
        ]);
        continue;
      }
      await pools.TOWN_MONSTER.query(SQL_QUERIES.UPDATE_CHARACTER_ITEM, [
        item.quantity,
        characterId,
        item.itemId,
      ]);
    } else {
      // 없다면 목록 생성
      await pools.TOWN_MONSTER.query(SQL_QUERIES.INSERT_CHARACTER_ITEM, [
        characterId,
        item.itemId,
        item.quantity,
      ]);
    }
  }
};
