CREATE TABLE IF NOT EXISTS Jobs
(
  job_id INTEGER NOT NULL PRIMARY KEY,
  job_name VARCHAR(50) NOT NULL UNIQUE,
  base_hp FLOAT NOT NULL,
  base_mp FLOAT NOT NULL,
  base_attack FLOAT NOT NULL,
  base_defense FLOAT NOT NULL,
  base_magic FLOAT NOT NULL,
  base_speed FLOAT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Users
(
  user_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Characters
(
  character_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INTEGER,
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
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (job_id) REFERENCES Jobs(job_id)
);

CREATE TABLE IF NOT EXISTS Character_Items
(
  character_item_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  character_id INTEGER,
  item_id INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (character_id) REFERENCES Characters(character_id)
);

//데이터 삽입

//Jobs 데이터 삽입

INSERT INTO Jobs (job_id , job_name , base_hp, base_mp, base_attack, base_defense, base_magic, base_speed, wide_effect, base_effect, single_effect ) VALUE 
( 1001, "섭르탄" , 1000, 40 , 50 , 80 , 100 , 10 , 3024, 3004, 3012 ),
( 1002, "클르탄" , 500, 60 , 80 , 40 , 100 , 10 , 3024 , 3004 , 3001),
( 1003, "디르탄" , 600 , 90 , 40, 60 , 100 , 10 , 3024, 3004, 3015),
( 1004, "큐르탄" , 800, 80 , 30 ,70 , 100 , 10, 3024, 3004, 3018),
( 1005, "기르탄" , 650 , 80, 50 , 60 , 100 , 10, 3024, 3004, 3008);