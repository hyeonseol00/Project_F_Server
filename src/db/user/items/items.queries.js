export const SQL_QUERIES = {
  GET_USER_ITEMS_BY_CHARACTER_ID: 'SELECT * FROM character_items WHERE character_id = ?',
  IS_EXIST_ITEM: 'SELECT * FROM character_items WHERE character_id = ? AND id = ?',
  UPDATE_CHARACTER_ITEM:
    'UPDATE character_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE character_id = ? AND id = ?',
  INSERT_CHARACTER_ITEM:
    'INSERT INTO character_items (character_id, id, quantity) VALUES (?, ?, ?)',
  DELETE_CHARACTER_ITEM: 'DELETE FROM character_items WHERE character_id = ? AND id = ?',
};
