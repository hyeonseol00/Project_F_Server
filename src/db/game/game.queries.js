export const SQL_GAME_QUERIES = {
  FIND_MONSTERS_BY_DUNGEON_MONSTERS: 'SELECT * FROM Dungeon_Monsters WHERE dungeon_id = ?',
  FIND_MONSTER_BY_MONSTERS: 'SELECT * FROM Monsters WHERE monster_id = ?',
  GET_MONSTER_EFFECT: 'SELECT monster_effect FROM Monsters WHERE monster_id = ?',
  GET_LEVEL_TABLE: 'SELECT * FROM Levels WHERE level_id = ?',
};
