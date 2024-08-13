import { toCamelCase } from '../../../utils/transformCase.js';
import pools from '../../database.js';
import { SQL_QUERIES } from './items.queries.js';

export const getUserItemsByCharacterId = async (characterId) => {
  const [rows] = await pools.TOWN_MONSTER.query(SQL_QUERIES.GET_USER_ITEMS_BY_CHARACTER_ID, [
    characterId,
  ]);

  return toCamelCase(rows);
};

export const existItem = async (characterId, id) => {
  const [rows] = await pools.TOWN_MONSTER.query(SQL_QUERIES.IS_EXIST_ITEM, [characterId, id]);

  if (rows.length) return true;
  return false;
};

export const updateCharacterItems = async (characterId, sessionItems) => {
  // 1. 데이터베이스에서 캐릭터의 모든 아이템을 가져옵니다.
  const dbItems = await getUserItemsByCharacterId(characterId);

  // 2. 데이터베이스에 있지만 세션에 없는 아이템을 찾아 삭제합니다.
  for (const dbItem of dbItems) {
    const sessionItem = sessionItems.find((item) => item.id === dbItem.itemId);
    if (!sessionItem) {
      await pools.TOWN_MONSTER.query(SQL_QUERIES.DELETE_CHARACTER_ITEM, [
        characterId,
        dbItem.itemId,
      ]);
    }
  }

  // 3. 세션 인벤토리를 데이터베이스에 업데이트합니다.
  for (const sessionItem of sessionItems) {
    const dbItem = dbItems.find((item) => item.id === sessionItem.id);
    if (dbItem) {
      // 데이터베이스에 이미 있는 경우 업데이트
      if (sessionItem.quantity > 0) {
        await pools.TOWN_MONSTER.query(SQL_QUERIES.UPDATE_CHARACTER_ITEM, [
          sessionItem.quantity,
          characterId,
          sessionItem.id,
        ]);
      } else {
        // 수량이 0인 경우 삭제
        await pools.TOWN_MONSTER.query(SQL_QUERIES.DELETE_CHARACTER_ITEM, [
          characterId,
          sessionItem.id,
        ]);
      }
    } else {
      // 데이터베이스에 없는 경우 새로 추가
      if (sessionItem.quantity > 0) {
        await pools.TOWN_MONSTER.query(SQL_QUERIES.INSERT_CHARACTER_ITEM, [
          characterId,
          sessionItem.id,
          sessionItem.quantity,
        ]);
      }
    }
  }
};
