export const SQL_QUERIES = {
  FIND_USER_BY_USERNAME: 'SELECT * FROM Users WHERE username = ?',
  INSERT_USER: 'INSERT INTO Users (username) VALUES (?)',
  GET_JOB_INFO: 'SELECT * FROM Jobs WHERE job_id = ?',
  FIND_CHARACTER_BY_USER_ID_AND_CLASS: 'SELECT * FROM Characters WHERE user_id = ? AND job_id = ?',
  INSERT_CHARACTER:
    'INSERT INTO Characters (user_id, name, job_id, job_name, MaxHp, MaxMp, hp, mp, attack, defense, magic, speed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
};
