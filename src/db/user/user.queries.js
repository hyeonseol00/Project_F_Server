export const SQL_QUERIES = {
  FIND_USER_BY_USERNAME: 'SELECT * FROM Users WHERE username = ?',
  INSERT_USER: 'INSERT INTO Users (username) VALUES (?)',
  REGISTER_USER: 'INSERT INTO Users (username, password) VALUES (?, ?)',
  GET_JOB_INFO: 'SELECT * FROM Jobs WHERE job_id = ?',
  FIND_CHARACTER_BY_USER_ID_AND_CLASS: 'SELECT * FROM Characters WHERE user_id = ? AND job_id = ?',
  INSERT_CHARACTER:
    'INSERT INTO Characters (user_id, character_name, job_id, job_name, max_hp, max_mp, cur_hp, cur_mp, attack, defense, magic, speed, critical, critical_attack, avoid_ability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  FIND_MONSTERS_BY_DUNGEON_MONSTERS: 'SELECT * FROM Dungeon_Monsters WHERE dungeon_id = ?',
  FIND_MONSTER_BY_MONSTERS: 'SELECT * FROM Monsters WHERE monster_id = ?',
  FIND_JOB_BY_ID: 'SELECT * FROM Jobs WHERE job_id = ?',
  GET_CHARACTER_BASE_EFFECT_CODE: 'SELECT base_effect FROM Jobs WHERE job_id = ?',
  GET_CHARACTER_SINGLE_EFFECT_CODE: 'SELECT single_effect FROM Jobs WHERE job_id = ?',
  GET_CHARACTER_WIDE_EFFECT_CODE: 'SELECT wide_effect FROM Jobs WHERE job_id = ?',
  UPDATE_CHARACTER_STATUS:
    'UPDATE Characters SET character_level = ?, experience = ?, cur_hp = ?, max_hp = ?, cur_mp = ?, max_mp = ?, attack = ?, defense = ?, magic = ?, speed = ?, critical = ?, critical_attack = ?, avoid_ability = ?, gold = ?, weapon = ?, armor = ?, gloves = ?, shoes = ?, accessory = ?,skill_point=?, updated_at = CURRENT_TIMESTAMP WHERE character_name = ? AND job_id = ?',
};
