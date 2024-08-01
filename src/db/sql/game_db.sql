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
  monster_gold INTEGER NOT NULL DEFAULT 0,
  monster_critical FLOAT NOT NULL,
  monster_critical_attack FLOAT NOT NULL,

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

CREATE TABLE IF NOT EXISTS Dungeon_Items
(
  dungeon_item_id INTEGER AUTO_INCREMENT PRIMARY KEY COMMENT 'Primary Key',
  dungeon_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  is_potion BIT(1) NOT NULL DEFAULT b'0',
  item_probability FLOAT NOT NULL DEFAULT '0',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
  item_hp FLOAT NOT NULL,
  item_mp FLOAT NOT NULL,
  item_attack FLOAT NOT NULL,
  item_defense FLOAT NOT NULL,
  item_magic FLOAT NOT NULL,
  item_speed FLOAT NOT NULL,
  item_cost INTEGER NOT NULL,
  require_level INTEGER NOT NULL,
  item_avoidance FLOAT DEFAULT '0',
  item_critical FLOAT DEFAULT '0',

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

CREATE TABLE IF NOT EXISTS Dungeon_Items
(
  dungeon_item_id INTEGER AUTO_INCREMENT PRIMARY KEY COMMENT 'Primary Key',
  dungeon_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  is_potion BIT(1) NOT NULL DEFAULT b'0',
  item_probability FLOAT NOT NULL DEFAULT '0',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
  world_level INTEGER NOT NULL,
  skill_point INTEGER NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS potion_items
(
  potion_id INTEGER AUTO_INCREMENT PRIMARY KEY COMMENT 'Primary Key',
  name VARCHAR(255) NOT NULL,
  hp_healing_amount FLOAT NOT NULL DEFAULT '0',
  mp_healing_amount FLOAT NOT NULL DEFAULT '0',
  exp_healing_amount INTEGER NOT NULL DEFAULT '0',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 데이터 삽입

-- 레벨 데이터 삽입
INSERT INTO Levels (level_id, required_exp, hp, mp, attack, defense, magic, speed, critical, critical_attack, avoid_ability, world_level ,skill_point) VALUES 
(1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0),
(2, 100, 10, 10, 2, 2, 2, 2, 1, 1, 1, 1, 1),
(3, 250, 10, 10, 2, 2, 2, 2, 1, 1, 1, 1, 1),
(4, 450, 15, 15, 3, 3, 3, 3, 1, 1, 1, 1, 1),
(5, 700, 15, 15, 3, 3, 3, 3, 1, 1, 1, 2, 2),
(6, 1000, 20, 20, 4, 4, 4, 4, 1, 1, 1, 2, 1),
(7, 1350, 25, 25, 4, 4, 4, 4, 1, 1, 1, 2, 1),
(8, 1750, 25, 25, 5, 5, 5, 5, 1, 1, 1, 2, 1),
(9, 2200, 30, 30, 5, 5, 5, 5, 1, 1, 1, 2, 1),
(10, 2700, 30, 30, 6, 6, 6, 6, 1, 1, 1, 3, 2),
(11, 3250, 35, 35, 6, 6, 6, 6, 1, 1, 1, 3, 1),
(12, 3850, 35, 35, 7, 7, 7, 7, 1, 1, 1, 3, 1),
(13, 4500, 40, 40, 7, 7, 7, 7, 1, 1, 1, 3, 1),
(14, 5200, 40, 40, 8, 8, 8, 8, 1, 1, 1, 3, 1),
(15, 5950, 45, 45, 8, 8, 8, 8, 1, 1, 1, 4, 2),
(16, 6750, 45, 45, 9, 9, 9, 9, 1, 1, 1, 4, 1),
(17, 7600, 50, 50, 9, 9, 9, 9, 1, 1, 1, 4, 1),
(18, 8500, 50, 50, 10, 10, 10, 10, 1, 1, 1, 4, 1),
(19, 9450, 60, 60, 10, 10, 10, 10, 1, 1, 1, 4, 1),
(20, 10450, 60, 60, 12, 12, 12, 12, 2, 2, 2, 5, 2);

-- 던전 데이터 삽입
INSERT INTO Dungeons (dungeon_id, dungeon_name, required_level) VALUES
(5001, "바람부는 평원", 1),
(5002, "얼어붙은 언덕", 1),
(5003, "만년설산", 1),
(5004, "무너진 신전", 1),
(5005, "버그의 둥지", 1),
(5006, "결투장", 1);

-- 몬스터 데이터 삽입 (*외래키 문제로 Dungeon_Monsters 보다 먼저 삽입되야 함*)
INSERT INTO Monsters (monster_id, monster_name, monster_hp, monster_attack, monster_exp, monster_effect , monster_gold, monster_critical, monster_critical_attack) VALUES
(2001, "빨간버섯", 300, 60, 10, 3005 , 100, 10, 150),
(2002, "외눈슬라임", 300, 60, 10, 3005 , 100, 10, 150),
(2003, "가시외눈달팽이", 300, 60, 10, 3004 , 100, 10, 150),
(2004, "파란멀록", 400, 60, 20, 3014 , 150, 12, 150),
(2005, "레넥톤", 400, 70, 30, 3003 , 160, 12, 150),
(2006, "네펜데스", 400, 70, 30, 3013 , 170, 12, 150),
(2007, "스켈레톤", 500, 80, 50, 3006 , 200, 15, 150),
(2008, "괴물쥐", 350, 70, 40, 3005 , 150, 12, 150),
(2009, "외눈두더지", 400, 70, 40, 3020 , 300, 15, 150),
(2010, "미믹", 500, 70, 50, 3006 , 300, 15, 150),
(2011, "샐러맨더", 650, 80, 60, 3019 , 350, 18, 150),
(2012, "외팔가재", 500, 70, 50, 3012 , 360, 15, 150),
(2013, "나가", 900, 80, 70, 3015 , 400, 20, 150),
(2014, "선인장", 350, 65, 40, 3003 , 100, 10, 150),
(2015, "오크병사", 700, 80, 60, 3011 , 420, 20, 150),
(2016, "리치", 1000, 85, 80, 3023 , 1000, 20, 150),
(2017, "버닝버드", 600, 70, 60, 3019 , 450, 18, 150),
(2018, "소드디멘터", 1200, 95, 100, 3001 , 1000, 25, 150),
(2019, "코로나", 600, 70, 60, 3023 , 500, 18, 150),
(2020, "말벌", 600, 70, 60, 3007 , 500, 18, 150),
(2021, "가오리샤크", 1300, 100, 120, 3014 , 1200, 25, 150),
(2022, "흡혈박쥐", 400, 70, 40, 3024 , 500, 12, 150),
(2023, "퍼플발록", 1600, 120, 150, 3024 , 550, 25, 150),
(2024, "워웍", 1800, 100, 150, 3001 , 1000, 25, 150),
(2025, "가디언", 2000, 110, 200, 3026 ,1200, 30, 150),
(2026, "골렘", 2200, 100, 200, 3008 , 2000, 30, 150),
(2027, "내셔", 2000, 130, 250, 3023 , 2500, 30, 150),
(2028, "팬텀나이트", 2500, 140, 250, 3002 , 3000, 30, 150),
(2029, "리저드킹", 3000, 180, 300, 3027 , 5000, 30, 150);

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

-- 소비 아이템 데이터 삽입
INSERT INTO potion_items (potion_id, name, hp_healing_amount, mp_healing_amount, exp_healing_amount)
VALUES 
(1, '체력 포션', 300, 0, 0),
(2, '마나 포션', 0, 100, 0),
(3, '경험치 포션', 0, 0, 10),
(4, '멀티 포션', 300, 100, 0);

-- 장착 아이템 데이터 삽입
INSERT INTO Items (item_id, item_name, item_type, item_hp, item_mp, item_attack, item_defense, item_magic, item_speed, item_cost, require_level, item_avoidance, item_critical)
VALUES 
(1, '초심자의 키보드', 'weapon', 0, 0, 100, 0, 0, 0, 1000, 1, 0, 0),
(2, '불타오르는 키보드', 'weapon', 0, 0, 200, 0, 0, 0, 5000, 5, 0, 0),
(3, '얼음의 서리 키보드', 'weapon', 0, 0, 180, 0, 0, 0, 6000, 5, 0, 0),
(4, '번개의 낙뢰 키보드', 'weapon', 0, 0, 250, 0, 0, 0, 7000, 10, 0, 0),
(5, '대지의 파괴 키보드', 'weapon', 0, 0, 300, 0, 0, 0, 8000, 10, 0, 0),
(6, '패왕의 키보드', 'weapon', 0, 0, 350, 0, 0, 0, -1, 10, 0, 0),
(7, '사냥꾼의 마우스', 'weapon', 0, 0, 80, 0, 0, 0, 1200, 1, 0, 0),
(8, '독의 비수 마우스', 'weapon', 0, 0, 150, 0, 0, 0, 6000, 5, 0, 0),
(9, '얼어붙은 마우스', 'weapon', 0, 0, 180, 0, 0, 0, 6500, 5, 0, 0),
(10, '천둥의 마우스', 'weapon', 0, 0, 220, 0, 0, 0, 7500, 10, 0, 0),
(11, '신속의 마우스', 'weapon', 0, 0, 250, 0, 0, 0, 8000, 10, 0, 0),
(12, '판타스틱 마우스', 'weapon', 0, 0, 300, 0, 0, 0, -1, 10, 0, 0),
(13, '마법사의 태블릿', 'weapon', 0, 0, 0, 0, 50, 0, 5000, 1, 0, 0),
(14, '얼음의 태블릿', 'weapon', 0, 0, 0, 0, 80, 0, 7000, 5, 0, 0),
(15, '불꽃의 태블릿', 'weapon', 0, 0, 0, 0, 100, 0, 7500, 5, 0, 0),
(16, '번개의 태블릿', 'weapon', 0, 0, 0, 0, 130, 0, 8000, 10, 0, 0),
(17, '현자의 태블릿', 'weapon', 0, 0, 0, 0, 150, 0, 9000, 10, 0, 0),
(18, '대마법사의 태블릿', 'weapon', 0, 0, 0, 0, 200, 0, -1, 10, 0, 0),
(19, '수습생의 후디', 'armor', 200, 0, 0, 150, 0, 0, 2000, 1, 0, 0),
(20, '강철의 수호자 후디', 'armor', 500, 0, 0, 300, 0, 0, 8000, 5, 0, 0),
(21, '불꽃의 후디', 'armor', 300, 0, 0, 350, 0, 0, 9000, 5, 0, 0),
(22, '얼음의 후디', 'armor', 400, 0, 0, 330, 0, 0, 8500, 5, 0, 0),
(23, '번개의 후디', 'armor', 600, 0, 0, 400, 0, 0, 10000, 10, 0, 0),
(24, '전사의 후디', 'armor', 1000, 0, 0, 500, 0, 0, -1, 10, 0, 0),
(25, '초심자의 헤드셋', 'armor', 0, 0, 0, 50, 0, 0, 1000, 1, 0, 0),
(26, '용사의 헤드셋', 'armor', 0, 0, 0, 100, 0, 0, 4000, 5, 0, 0),
(27, '불꽃의 헤드셋', 'armor', 0, 0, 0, 120, 0, 0, 4500, 5, 0, 0),
(28, '서리의 헤드셋', 'armor', 0, 0, 0, 110, 0, 0, 4200, 5, 0, 0),
(29, '번개의 헤드셋', 'armor', 0, 0, 0, 150, 0, 0, 5000, 10, 0, 0),
(30, '초보자의 보호장갑', 'gloves', 100, 0, 0, 0, 0, 0, 1500, 1, 0.05, 0),
(31, '드래곤 보호장갑', 'gloves', 250, 0, 0, 0, 0, 0, 7500, 5, 0.07, 0),
(32, '불꽃의 보호장갑', 'gloves', 200, 0, 0, 0, 0, 0, 7000, 5, 0.08, 0),
(33, '얼음의 보호장갑', 'gloves', 180, 0, 0, 0, 0, 0, 8000, 5, 0.1, 0),
(34, '번개의 보호장갑', 'gloves', 220, 0, 0, 0, 0, 0, -1, 10, 0.12, 0),
(35, '초심자의 운동화', 'shoes', 0, 0, 0, 50, 0, 2, 1000, 1, 0, 0),
(36, '바람의 운동화', 'shoes', 0, 0, 0, 100, 0, 5, 3000, 5, 0, 0),
(37, '불꽃의 운동화', 'shoes', 0, 0, 0, 120, 0, 3, 4000, 5, 0, 0),
(38, '얼음의 운동화', 'shoes', 0, 0, 0, 100, 0, 4, 3500, 5, 0, 0),
(39, '번개의 크록스', 'shoes', 0, 0, 0, 150, 0, 6, 5000, 10, 0, 0),
(40, '대지의 삼선슬리퍼', 'shoes', 0, 0, 0, 200, 0, 10, -1, 10, 0, 0),
(41, '초심자의 USB', 'accessory', 100, 100, 0, 50, 0, 0, 1000, 1, 0, 0),
(42, '불꽃의 USB', 'accessory', 200, 100, 0, 100, 50, 0, 5000, 5, 0.05, 0),
(43, '얼음의 USB', 'accessory', 150, 150, 0, 80, 50, 0, 7500, 5, 0.1, 0),
(44, '카시오시계', 'accessory', 100, 100, 0, 100, 100, 0, 10000, 10, 0.15, 0),
(45, '스마트워치', 'accessory', 200, 200, 0, 200, 200, 0, -1, 10, 0.2, 0);

-- 던전 별 보상 아이템 데이터 삽입
INSERT INTO `Dungeon_Items` (dungeon_item_id, dungeon_id, item_id, is_potion, item_probability) VALUES
(1, 5001, 1, true, 1),
(2, 5001, 2, true, 1),
(3, 5001, 3, true, 1),
(4, 5001, 4, true, 1),
(6, 5002, 1, true, 1),
(7, 5002, 2, true, 1),
(8, 5002, 3, true, 1),
(9, 5002, 4, true, 1),
(10, 5003, 1, true, 1),
(11, 5003, 2, true, 1),
(12, 5003, 3, true, 1),
(13, 5003, 4, true, 1),
(14, 5004, 1, true, 1),
(15, 5004, 2, true, 1),
(16, 5004, 3, true, 1),
(17, 5004, 4, true, 1),
(18, 5005, 1, true, 1),
(19, 5005, 2, true, 1),
(20, 5005, 3, true, 1),
(21, 5005, 4, true, 1),
(22, 5001, 1, false, 95),
(23, 5001, 7, false, 95),
(24, 5001, 13, false, 95),
(25, 5001, 19, false, 95),
(26, 5001, 25, false, 95),
(27, 5001, 30, false, 95),
(28, 5001, 35, false, 95),
(29, 5001, 41, false, 95),
(30, 5001, 2, false, 5),
(31, 5001, 8, false, 5),
(32, 5001, 14, false, 5),
(33, 5001, 20, false, 5),
(34, 5001, 26, false, 5),
(35, 5001, 31, false, 5),
(36, 5001, 36, false, 5),
(37, 5001, 42, false, 5),
(38, 5002, 1, false, 90),
(39, 5002, 7, false, 90),
(40, 5002, 13, false, 90),
(41, 5002, 19, false, 90),
(42, 5002, 25, false, 90),
(43, 5002, 30, false, 90),
(44, 5002, 35, false, 90),
(45, 5002, 41, false, 90),
(46, 5002, 2, false, 5),
(47, 5002, 8, false, 5),
(48, 5002, 14, false, 5),
(49, 5002, 20, false, 5),
(50, 5002, 26, false, 5),
(51, 5002, 31, false, 5),
(52, 5002, 36, false, 5),
(53, 5002, 42, false, 5),
(54, 5002, 3, false, 5),
(55, 5002, 9, false, 5),
(56, 5002, 15, false, 5),
(57, 5002, 21, false, 5),
(58, 5002, 27, false, 5),
(59, 5002, 32, false, 5),
(60, 5002, 37, false, 5),
(61, 5002, 43, false, 5),
(62, 5003, 1, false, 80),
(63, 5003, 7, false, 80),
(64, 5003, 13, false, 80),
(65, 5003, 19, false, 80),
(66, 5003, 25, false, 80),
(67, 5003, 30, false, 80),
(68, 5003, 35, false, 80),
(69, 5003, 41, false, 80),
(70, 5003, 2, false, 10),
(71, 5003, 8, false, 10),
(72, 5003, 14, false, 10),
(73, 5003, 20, false, 10),
(74, 5003, 26, false, 10),
(75, 5003, 31, false, 10),
(76, 5003, 36, false, 10),
(77, 5003, 42, false, 10),
(78, 5003, 3, false, 5),
(79, 5003, 9, false, 5),
(80, 5003, 15, false, 5),
(81, 5003, 21, false, 5),
(82, 5003, 27, false, 5),
(83, 5003, 32, false, 5),
(84, 5003, 37, false, 5),
(85, 5003, 43, false, 5),
(86, 5003, 22, false, 5),
(87, 5003, 28, false, 5),
(88, 5003, 33, false, 5),
(89, 5003, 38, false, 5),
(90, 5004, 1, false, 75),
(91, 5004, 7, false, 75),
(92, 5004, 13, false, 75),
(93, 5004, 19, false, 75),
(94, 5004, 25, false, 75),
(95, 5004, 30, false, 75),
(96, 5004, 35, false, 75),
(97, 5004, 41, false, 75),
(98, 5004, 2, false, 10),
(99, 5004, 8, false, 10),
(100, 5004, 14, false, 10),
(101, 5004, 20, false, 10),
(102, 5004, 26, false, 10),
(103, 5004, 31, false, 10),
(104, 5004, 36, false, 10),
(105, 5004, 42, false, 10),
(106, 5004, 3, false, 10),
(107, 5004, 9, false, 10),
(108, 5004, 15, false, 10),
(109, 5004, 21, false, 10),
(110, 5004, 27, false, 10),
(111, 5004, 32, false, 10),
(112, 5004, 37, false, 10),
(113, 5004, 43, false, 10),
(114, 5004, 22, false, 5),
(115, 5004, 28, false, 5),
(116, 5004, 33, false, 5),
(117, 5004, 38, false, 5),
(118, 5004, 6, false, 1),
(119, 5004, 12, false, 1),
(120, 5004, 18, false, 1),
(121, 5004, 24, false, 1),
(122, 5004, 34, false, 1),
(123, 5004, 40, false, 1),
(124, 5004, 45, false, 1);

