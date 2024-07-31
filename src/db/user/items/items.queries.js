export const SQL_QUERIES = {
  GET_USER_POTION_ITEMS_BY_CHARACTER_ID:
    'SELECT * FROM Character_Items WHERE character_id = ? AND is_potion',
  GET_USER_MOUNTING_ITEMS_BY_CHARACTER_ID:
    'SELECT * FROM Character_Items WHERE character_id = ? AND is_potion = false',
};
