export const SQL_QUERIES = {
  FIND_USER_BY_DEVICE_ID: 'SELECT * FROM coordinates_backup WHERE device_id = ?',
  BACKUP_COORDINATE: 'INSERT INTO coordinates_backup (id, device_id, x, y) VALUES (?, ?, ?, ?)',
  UPDATE_COORDINATE: 'UPDATE coordinates_backup SET x = ?, y = ? WHERE device_id = ?',
};
