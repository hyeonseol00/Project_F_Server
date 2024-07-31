-- 외래키 문제로 데이터 먼저 삭제
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE Levels;
DROP TABLE Dungeons;
DROP TABLE Dungeon_Monsters;
DROP TABLE Effects;
DROP TABLE Monsters;
SET FOREIGN_KEY_CHECKS = 1;


CREATE TABLE IF NOT EXISTS Effects
(
  effect_id INTEGER NOT NULL PRIMARY KEY,
  effect_name VARCHAR(100) NOT NULL,
  effect_type VARCHAR(50) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Dungeons
(
  dungeon_id INTEGER NOT NULL PRIMARY KEY,
  dungeon_name VARCHAR(100) NOT NULL,
  required_level INTEGER DEFAULT 1,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Monsters
(
  monster_id INTEGER NOT NULL PRIMARY KEY,
  monster_name VARCHAR(100) NOT NULL,
  monster_hp FLOAT NOT NULL,
  monster_attack FLOAT NOT NULL,
  monster_exp INTEGER NOT NULL,
  monster_effect INTEGER NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Dungeon_Monsters
(
  dungeon_monster_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dungeon_id INTEGER,
  monster_id INTEGER,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (dungeon_id) REFERENCES Dungeons(dungeon_id),
  FOREIGN KEY (monster_id) REFERENCES Monsters(monster_id)
);

CREATE TABLE IF NOT EXISTS Shops
(
  shop_id INTEGER AUTO_INCREMENT PRIMARY KEY,
  shop_name VARCHAR(100) UNIQUE NOT NULL,
  shop_location VARCHAR(100),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Items
(
  item_id INTEGER AUTO_INCREMENT PRIMARY KEY,
  item_name VARCHAR(100) NOT NULL,
  item_description TEXT,
  item_type VARCHAR(50),
  item_rarity VARCHAR(50),
  item_effect_id INTEGER DEFAULT 1,
  item_hp FLOAT NOT NULL,
  item_mp FLOAT NOT NULL,
  item_attack FLOAT NOT NULL,
  item_defense FLOAT NOT NULL,
  item_magic FLOAT NOT NULL,
  item_speed FLOAT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Shop_Items
(
  shop_item_id INTEGER AUTO_INCREMENT PRIMARY KEY,
  shop_id INTEGER,
  item_id INTEGER,
  price INTEGER NOT NULL,
  stock INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (shop_id) REFERENCES Shops(shop_id),
  FOREIGN KEY (item_id) REFERENCES Items(item_id)
);

CREATE TABLE IF NOT EXISTS Levels
(
  level_id INTEGER AUTO_INCREMENT PRIMARY KEY,
  required_exp INTEGER NOT NULL,
  hp FLOAT NOT NULL,
  mp FLOAT NOT NULL,
  attack FLOAT NOT NULL,
  defense FLOAT NOT NULL,
  magic FLOAT NOT NULL,
  speed FLOAT NOT NULL,
  critical FLOAT NOT NULL,
  critical_attack FLOAT NOT NULL,
  avoid_ability FLOAT NOT NULL,
  skill_point INTEGER NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 데이터 삽입

-- 레벨 데이터 삽입
INSERT INTO Levels (level_id, required_exp, hp, mp, attack, defense, magic, speed, critical, critical_attack, avoid_ability, skill_point) VALUES 
(1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(2, 100, 10, 10, 2, 2, 2, 2, 1, 1, 1, 1),
(3, 250, 10, 10, 2, 2, 2, 2, 1, 1, 1, 1),
(4, 450, 15, 15, 3, 3, 3, 3, 1, 1, 1, 1),
(5, 700, 15, 15, 3, 3, 3, 3, 1, 1, 1, 2),
(6, 1000, 20, 20, 4, 4, 4, 4, 1, 1, 1, 1),
(7, 1350, 25, 25, 4, 4, 4, 4, 1, 1, 1, 1),
(8, 1750, 25, 25, 5, 5, 5, 5, 1, 1, 1, 1),
(9, 2200, 30, 30, 5, 5, 5, 5, 1, 1, 1, 1),
(10, 2700, 30, 30, 6, 6, 6, 6, 1, 1, 1, 2),
(11, 3250, 35, 35, 6, 6, 6, 6, 1, 1, 1, 1),
(12, 3850, 35, 35, 7, 7, 7, 7, 1, 1, 1, 1),
(13, 4500, 40, 40, 7, 7, 7, 7, 1, 1, 1, 1),
(14, 5200, 40, 40, 8, 8, 8, 8, 1, 1, 1, 1),
(15, 5950, 45, 45, 8, 8, 8, 8, 1, 1, 1, 2),
(16, 6750, 45, 45, 9, 9, 9, 9, 1, 1, 1, 1),
(17, 7600, 50, 50, 9, 9, 9, 9, 1, 1, 1, 1),
(18, 8500, 50, 50, 10, 10, 10, 10, 1, 1, 1, 1),
(19, 9450, 60, 60, 10, 10, 10, 10, 1, 1, 1, 1),
(20, 10450, 60, 60, 12, 12, 12, 12, 2, 2, 2, 2);

-- 던전 데이터 삽입
INSERT INTO Dungeons (dungeon_id, dungeon_name, required_level) VALUES
(5001, "바람부는 평원", 1),
(5002, "얼어붙은 언덕", 1),
(5003, "만년설산", 1),
(5004, "무너진 신전", 1),
(5005, "버그의 둥지", 1),
(5006, "결투장", 1);

-- 몬스터 데이터 삽입 (*외래키 문제로 Dungeon_Monsters 보다 먼저 삽입되야 함*)
INSERT INTO Monsters (monster_id, monster_name, monster_hp, monster_attack, monster_exp, monster_effect) VALUES
(2001, "빨간버섯", 300, 60, 10, 3005),
(2002, "외눈슬라임", 300, 60, 10, 3005),
(2003, "가시외눈달팽이", 300, 60, 10, 3004),
(2004, "파란멀록", 400, 60, 20, 3014),
(2005, "레넥톤", 400, 70, 30, 3003),
(2006, "네펜데스", 400, 70, 30, 3013),
(2007, "스켈레톤", 500, 80, 50, 3006),
(2008, "괴물쥐", 350, 70, 40, 3005),
(2009, "외눈두더지", 400, 70, 40, 3020),
(2010, "미믹", 500, 70, 50, 3006),
(2011, "샐러맨더", 650, 80, 60, 3019),
(2012, "외팔가재", 500, 70, 50, 3012),
(2013, "나가", 900, 80, 70, 3015),
(2014, "선인장", 350, 65, 40, 3003),
(2015, "오크병사", 700, 80, 60, 3011),
(2016, "리치", 1000, 85, 80, 3023),
(2017, "버닝버드", 600, 70, 60, 3019),
(2018, "소드디멘터", 1200, 95, 100, 3001),
(2019, "코로나", 600, 70, 60, 3023),
(2020, "말벌", 600, 70, 60, 3007),
(2021, "가오리샤크", 1300, 100, 120, 3014),
(2022, "흡혈박쥐", 400, 70, 40, 3024),
(2023, "퍼플발록", 1600, 120, 150, 3024),
(2024, "워웍", 1800, 100, 150, 3001),
(2025, "가디언", 2000, 110, 200, 3026),
(2026, "골렘", 2200, 100, 200, 3008),
(2027, "내셔", 2000, 130, 250, 3023),
(2028, "팬텀나이트", 2500, 140, 250, 3002),
(2029, "리저드킹", 3000, 180, 300, 3027);

-- 던전 별 출현 몬스터 데이터 삽입
INSERT INTO Dungeon_Monsters (dungeon_monster_id, dungeon_id, monster_id) VALUES
(1, 5001, 2001),
(2, 5001, 2002),
(3, 5001, 2003),
(4, 5001, 2006),
(5, 5001, 2009),
(6, 5001, 2014),
(7, 5002, 2004),
(8, 5002, 2007),
(9, 5002, 2010),
(10, 5002, 2016),
(11, 5002, 2019),
(12, 5002, 2022),
(13, 5003, 2008),
(14, 5003, 2015),
(15, 5003, 2018),
(16, 5003, 2021),
(17, 5003, 2024),
(18, 5004, 2012),
(19, 5004, 2013),
(20, 5004, 2017),
(21, 5004, 2020),
(22, 5005, 2023),
(23, 5005, 2025),
(24, 5005, 2026),
(25, 5005, 2027),
(26, 5005, 2028),
(27, 5005, 2029);

-- 이펙트 데이터 삽입
INSERT INTO Effects (effect_id, effect_name, effect_type) VALUES
(3001, "Effect1", "단일 대상"),
(3002, "Effect2", "단일 대상"),
(3003, "Effect3", "단일 대상"),
(3004, "Effect4", "단일 대상"),
(3005, "Effect5", "단일 대상"),
(3006, "Effect6", "단일 대상"),
(3007, "Effect7", "단일 대상"),
(3008, "Effect8", "단일 대상"),
(3009, "Effect9", "단일 대상"),
(3010, "Effect10", "단일 대상"),
(3011, "Effect11", "단일 대상"),
(3012, "Effect12", "단일 대상"),
(3013, "Effect13", "단일 대상"),
(3014, "Effect14", "단일 대상"),
(3015, "Effect15", "단일 대상"),
(3016, "Effect16", "단일 대상"),
(3017, "Effect17", "단일 대상"),
(3018, "Effect18", "단일 대상"),
(3019, "Effect19", "단일 대상"),
(3020, "Effect20", "단일 대상"),
(3021, "Effect21", "단일 대상"),
(3022, "Effect22", "단일 대상"),
(3023, "Effect23", "단일 대상"),
(3024, "Effect24", "전체 대상"),
(3025, "Effect25", "전체 대상"),
(3026, "Effect26", "전체 대상"),
(3027, "Effect27", "전체 대상");

