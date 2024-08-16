-- 외래키 문제로 데이터 먼저 삭제
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE jobs;
DROP TABLE characters;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE IF NOT EXISTS jobs
(
  job_id INTEGER NOT NULL PRIMARY KEY,
  job_name VARCHAR(50) NOT NULL UNIQUE,
  base_hp FLOAT NOT NULL,
  base_mp FLOAT NOT NULL,
  base_attack FLOAT NOT NULL,
  base_defense FLOAT NOT NULL,
  base_magic FLOAT NOT NULL,
  base_speed FLOAT NOT NULL,
  base_critical FLOAT NOT NULL,
  base_critical_attack FLOAT NOT NULL,
  base_avoid_ability FLOAT NOT NULL,
  base_effect INTEGER NOT NULL,
  single_effect INTEGER NOT NULL,
  wide_effect INTEGER NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users
(
  `user_id` INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS characters
(
  character_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` INTEGER,
  character_name VARCHAR(50) NOT NULL,
  character_level INTEGER NOT NULL DEFAULT 1,
  experience INTEGER NOT NULL,
  job_id INTEGER,
  job_name VARCHAR(50) NOT NULL,
  cur_hp FLOAT NOT NULL,
  max_hp FLOAT NOT NULL,
  cur_mp FLOAT NOT NULL,
  max_mp FLOAT NOT NULL,
  attack FLOAT NOT NULL,
  defense FLOAT NOT NULL,
  magic FLOAT NOT NULL,
  speed FLOAT NOT NULL,
  critical FLOAT NOT NULL,
  critical_attack FLOAT NOT NULL,
  avoid_ability FLOAT NOT NULL,
  gold INTEGER NOT NULL DEFAULT 0,
  world_level INTEGER NOT NULL DEFAULT 1,
  skill_point INTEGER NOT NULL DEFAULT 0,
  weapon INTEGER NOT NULL DEFAULT 0,
  armor INTEGER NOT NULL DEFAULT 0,
  gloves INTEGER NOT NULL DEFAULT 0,
  shoes INTEGER NOT NULL DEFAULT 0,
  accessory INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (`user_id`) REFERENCES users(`user_id`),
  FOREIGN KEY (job_id) REFERENCES jobs(job_id)
);

CREATE TABLE IF NOT EXISTS character_Items
(
  character_item_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  character_id INTEGER,
  `id` INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (character_id) REFERENCES characters(character_id)
);

CREATE TABLE user_quests
(
  character_id INTEGER NOT NULL,
  quest_id INTEGER NOT NULL,
  kill_count INTEGER DEFAULT 0,
  `status` ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'NOT_STARTED',
  completed_at TIMESTAMP DEFAULT NULL,
  PRIMARY KEY (character_id, quest_id),
);

-- 데이터 삽입

-- Jobs 데이터 삽입
INSERT INTO jobs (job_id , job_name , base_hp, base_mp, base_attack, base_defense, base_magic, base_speed, base_critical, base_critical_attack, base_avoid_ability, wide_effect, base_effect, single_effect ) VALUE 
( 1001, "섭르탄" , 1000, 140, 150, 150, 200, 10, 5, 150, 5, 3024, 3004, 3012),
( 1002, "클르탄" , 1000, 160, 180, 180, 200, 10, 5, 150, 5, 3024, 3004, 3001),
( 1003, "디르탄" , 900 , 190, 140, 160, 200, 10, 5, 150, 5, 3024, 3004, 3015),
( 1004, "큐르탄" , 1100, 180, 130, 170, 200, 10, 5, 150, 5, 3024, 3004, 3018),
( 1005, "기르탄" , 900 , 180, 150, 160, 200, 10, 5, 150, 5, 3024, 3004, 3008);