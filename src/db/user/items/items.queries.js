export const SQL_QUERIES = {
  GET_USER_ITEMS_BY_CHARACTER_ID: 'SELECT * FROM Character_Items WHERE character_id = ?',
  IS_EXIST_ITEM: 'SELECT * FROM Character_Items WHERE character_id = ? AND item_id = ?',
  UPDATE_CHARACTER_ITEM:
    'UPDATE Character_Items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE character_id = ? AND item_id = ?',
  INSERT_CHARACTER_ITEM:
    'INSERT INTO Character_Items (character_id, item_id, quantity) VALUES (?, ?, ?)',
};
