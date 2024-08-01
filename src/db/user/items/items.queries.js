export const SQL_QUERIES = {
  GET_USER_POTION_ITEMS_BY_CHARACTER_ID:
    'SELECT * FROM Character_Items WHERE character_id = ? AND is_potion',
  GET_USER_MOUNTING_ITEMS_BY_CHARACTER_ID:
    'SELECT * FROM Character_Items WHERE character_id = ? AND is_potion = false',
  IS_EXIST_ITEM:
    'SELECT * FROM Character_Items WHERE character_id = ? AND item_id = ? AND is_potion = ?',
  UPDATE_CHARACTER_ITEM:
    'UPDATE Character_Items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE character_id = ? AND item_id = ? AND is_potion = ?',
  INSERT_CHARACTER_ITEM:
    'INSERT INTO Character_Items (character_id, item_id, quantity, is_potion) VALUES (?, ?, ?, ?)',
};
