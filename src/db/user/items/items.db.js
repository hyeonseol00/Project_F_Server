import { toCamelCase } from '../../../utils/transformCase.js';
import pools from '../../database.js';
import { SQL_QUERIES } from './items.queries.js';

export const getUserPotionItemsByCharacterId = async (characterId) => {
  const [rows] = await pools.TOWN_MONSTER.query(SQL_QUERIES.GET_USER_POTION_ITEMS_BY_CHARACTER_ID, [
    characterId,
  ]);

  return toCamelCase(rows);
};

export const getUserMountingItemsByCharacterId = async (characterId) => {
  const [rows] = await pools.TOWN_MONSTER.query(
    SQL_QUERIES.GET_USER_MOUNTING_ITEMS_BY_CHARACTER_ID,
    [characterId],
  );

  return toCamelCase(rows);
};

export const existItem = async (characterId, itemId, isPotion) => {
  const [rows] = await pools.TOWN_MONSTER.query(SQL_QUERIES.IS_EXIST_ITEM, [
    characterId,
    itemId,
    isPotion,
  ]);

  if (rows.length) return true;
  return false;
};

export const updateCharacterPotions = async (characterId, potions) => {
  for (const potion of potions) {
    if (await existItem(characterId, potion.itemId, true)) {
      // item 목록이 있다면 update
      await pools.TOWN_MONSTER.query(SQL_QUERIES.UPDATE_CHARACTER_ITEM, [
        potion.quantity,
        characterId,
        potion.itemId,
        true,
      ]);
    } else {
      // 없다면 목록 생성
      await pools.TOWN_MONSTER.query(SQL_QUERIES.INSERT_CHARACTER_ITEM, [
        characterId,
        potion.itemId,
        potion.quantity,
        true,
      ]);
    }
  }
};

export const updateCharacterMountingItems = async (characterId, mountingItems) => {
  for (const item of mountingItems) {
    if (await existItem(characterId, item.itemId, false)) {
      // item 목록이 있다면 update
      await pools.TOWN_MONSTER.query(SQL_QUERIES.UPDATE_CHARACTER_ITEM, [
        item.quantity,
        characterId,
        item.itemId,
        false,
      ]);
    } else {
      // 없다면 목록 생성
      await pools.TOWN_MONSTER.query(SQL_QUERIES.INSERT_CHARACTER_ITEM, [
        characterId,
        item.itemId,
        item.quantity,
        false,
      ]);
    }
  }
};
