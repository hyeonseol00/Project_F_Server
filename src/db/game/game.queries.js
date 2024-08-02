export const SQL_GAME_QUERIES = {
  FIND_MONSTERS_BY_DUNGEON_MONSTERS: 'SELECT * FROM Dungeon_Monsters WHERE dungeon_id = ?',
  FIND_MONSTER_BY_MONSTERS: 'SELECT * FROM Monsters WHERE monster_id = ?',
  GET_MONSTER_EFFECT: 'SELECT monster_effect FROM Monsters WHERE monster_id = ?',
  GET_LEVEL_TABLE: 'SELECT * FROM Levels',
  GET_DUNGEON_ITEMS: 'SELECT * FROM Dungeon_Items WHERE dungeon_id = ?',
  GET_ITEMS: 'SELECT * FROM Items',
  GET_ITEM: 'SELECT * FROM Items WHERE item_id = ?',
};
