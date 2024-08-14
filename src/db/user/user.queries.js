export const SQL_QUERIES = {
  FIND_USER_BY_USERNAME: 'SELECT * FROM users WHERE username = ?',
  INSERT_USER: 'INSERT INTO users (username) VALUES (?)',
  REGISTER_USER: 'INSERT INTO users (username, password) VALUES (?, ?)',
  GET_JOB_INFO: 'SELECT * FROM jobs WHERE job_id = ?',
  FIND_CHARACTER_BY_USER_ID_AND_CLASS: 'SELECT * FROM characters WHERE user_id = ? AND job_id = ?',
  INSERT_CHARACTER:
    'INSERT INTO characters (user_id, character_name, job_id, job_name, max_hp, max_mp, cur_hp, cur_mp, attack, defense, magic, speed, critical, critical_attack, avoid_ability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  FIND_JOB_BY_ID: 'SELECT * FROM jobs WHERE job_id = ?',
  GET_CHARACTER_BASE_EFFECT_CODE: 'SELECT base_effect FROM jobs WHERE job_id = ?',
  GET_CHARACTER_SINGLE_EFFECT_CODE: 'SELECT single_effect FROM jobs WHERE job_id = ?',
  GET_CHARACTER_WIDE_EFFECT_CODE: 'SELECT wide_effect FROM jobs WHERE job_id = ?',
  UPDATE_CHARACTER_STATUS:
    'UPDATE characters SET character_level = ?, experience = ?, cur_hp = ?, max_hp = ?, cur_mp = ?, max_mp = ?, attack = ?, defense = ?, magic = ?, speed = ?, critical = ?, critical_attack = ?, avoid_ability = ?, gold = ?, world_level = ?, skill_point=?, weapon = ?, armor = ?, gloves = ?, shoes = ?, accessory = ?, updated_at = CURRENT_TIMESTAMP WHERE character_name = ? AND job_id = ?',
};

export const SQL_QUEST_QUERIES = {
  ADD_QUEST: `
    INSERT INTO quests (quest_name, quest_description, quest_level, monster_count, reward_exp, reward_gold)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
  UPDATE_QUEST_PROGRESS: `
    UPDATE user_quests
    SET kill_count = ?, status = ?
    WHERE character_id = ? AND quest_id = ?
  `,
  GET_USER_QUESTS: 'SELECT * FROM user_quests WHERE character_id = ?',
  ADD_USER_QUEST: `
    INSERT INTO user_quests (character_id, quest_id, kill_count, status)
    VALUES (?, ?, ?, ?)
  `,

  REMOVE_USER_QUEST: `
  DELETE FROM user_quests
  WHERE character_id = ? AND quest_id = ?
`,
};
