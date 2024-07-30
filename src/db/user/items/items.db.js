import { toCamelCase } from '../../../utils/transformCase.js';
import pools from '../../database.js';
import { SQL_QUERIES } from './items.queries.js';

export const getUserPotionItemsByCharacterId = async (characterId) => {
  const [rows] = await pools.TOWN_MONSTER.query(SQL_QUERIES.GET_USER_POTION_ITEMS_BY_CHARACTER_ID, [
    characterId,
  ]);

  return toCamelCase(rows);
};

// export const insertUserByUsername = async (username) => {
//   await pools.TOWN_MONSTER.query(SQL_QUERIES.INSERT_USER, [username]);
// };
