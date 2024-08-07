export const SQL_GAME_QUERIES = {
  FIND_MONSTERS_BY_DUNGEON_ID: 'SELECT * FROM dungeon_monsters WHERE dungeon_id = ?',
  FIND_MONSTER_BY_ID: 'SELECT * FROM monsters WHERE monster_id = ?',
  GET_MONSTER_EFFECT_BY_ID: 'SELECT monster_effect FROM monsters WHERE monster_id = ?',
  GET_ALL_LEVEL_DATA: 'SELECT * FROM levels',
  FIND_ITEMS_BY_DUNGEON_CODE: 'SELECT * FROM dungeon_items WHERE dungeon_id = ?',
  GET_ITEM: 'SELECT * FROM items WHERE item_id = ?',
  GET_ALL_ITEM_DATA: 'SELECT * FROM items',
  GET_MONSTER: 'SELECT * FROM monsters',
};
