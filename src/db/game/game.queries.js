export const SQL_GAME_QUERIES = {
  FIND_MONSTERS_BY_DUNGEON_ID: 'SELECT * FROM dungeon_monsters WHERE dungeon_id = ?',
  FIND_MONSTER_BY_ID: 'SELECT * FROM monsters WHERE monster_id = ?',
  GET_MONSTER_EFFECT_BY_ID: 'SELECT monster_effect FROM monsters WHERE monster_id = ?',
  GET_ALL_LEVEL_DATA: 'SELECT * FROM levels',
  GET_DUNGEON_ITEMS: 'SELECT * FROM dungeon_items',
  GET_ITEM: 'SELECT * FROM items WHERE item_id = ?',
  GET_ALL_ITEM_DATA: 'SELECT * FROM items',
  GET_MONSTER: 'SELECT * FROM monsters',
  GET_DUNGEON_MONSTER: 'SELECT * FROM dungeon_monsters',
};

export const SQL_QUEST_QUERIES = {
  FIND_QUEST_BY_ID: 'SELECT * FROM quests WHERE quest_id = ?',
  GET_ALL_QUESTS: 'SELECT * FROM quests',
  ADD_QUEST: `
    INSERT INTO quests (quest_name, quest_description, quest_level, monster_count, reward_exp, reward_gold)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
  UPDATE_QUEST_PROGRESS: `
    UPDATE user_quests
    SET progress = ?, status = ?
    WHERE user_id = ? AND quest_id = ?
  `,
  GET_USER_QUESTS: 'SELECT * FROM user_quests WHERE user_id = ?',
  ADD_USER_QUEST: `
    INSERT INTO user_quests (user_id, quest_id, progress, status)
    VALUES (?, ?, ?, ?)
  `,
};
