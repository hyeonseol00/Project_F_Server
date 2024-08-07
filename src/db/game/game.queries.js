export const SQL_GAME_QUERIES = {
  FIND_MONSTERS_BY_DUNGEON_ID: 'SELECT * FROM Dungeon_Monsters WHERE dungeon_id = ?',
  FIND_MONSTER_BY_ID: 'SELECT * FROM Monsters WHERE monster_id = ?',
  GET_MONSTER_EFFECT_BY_ID: 'SELECT monster_effect FROM Monsters WHERE monster_id = ?',
  GET_ALL_LEVEL_DATA: 'SELECT * FROM Levels',
  FIND_ITEMS_BY_DUNGEON_CODE: 'SELECT * FROM Dungeon_Items WHERE dungeon_id = ?',
  GET_ITEM: 'SELECT * FROM Items WHERE item_id = ?',
  GET_ALL_ITEM_DATA: 'SELECT * FROM Items',
  GET_MONSTER: 'SELECT * FROM Monsters',
  GET_DUNGEON_MONSTER: 'SELECT * FROM Dungeon_Monsters',
};
