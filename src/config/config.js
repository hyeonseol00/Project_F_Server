import {
  BUTTON_COMMON_ATTACK,
  BUTTON_SKILL_ATTACK,
  BUTTON_RUNAWAY,
  BUTTON_ITEM,
} from '../constants/battle/actionSceneButton.js';
import { NORMAL_HIT, SINGLE_SKILL, WIDE_AREA_SKILL } from '../constants/battle/attackType.js';
import {
  PLAYER_MAX_LEVEL,
  RESPAWN_HP,
  WORLD_LEVEL_1_CONFIG,
  WORLD_LEVEL_2_CONFIG,
  WORLD_LEVEL_3_CONFIG,
  WORLD_LEVEL_4_CONFIG,
  WORLD_LEVEL_5_CONFIG,
} from '../constants/battle/battleSceneConfig.js';
import {
  SCENE_CHOOSE_TARGET,
  SCENE_MESSAGE_WINDOW,
  SCENE_CHOOSE_ACTION,
  SCENE_CONFIRM,
  SCENE_CHOOSE_SKILL_TYPE,
  SCENE_CHOOSE_TARGET_WITH_SKILL,
  SCENE_PLAYER_ATTACK,
  SCENE_ENEMY_ATTACK,
  SCENE_MONSTER_DEAD,
  SCENE_GAME_OVER_WIN,
  SCENE_GAME_OVER_LOSE,
  SCENE_GET_EXP,
  SCENE_GO_TO_TOWN,
  SCENE_ITEM_SELECT,
  SCENE_ITEM_USING,
  SCENE_ITEM_DROP,
  SCENE_ITEM_CHOOSE,
} from '../constants/battle/battleSceneStatus.js';
import { BUTTON_CONFIRM, BUTTON_CANCEL } from '../constants/battle/confirmSceneButton.js';
import {
  BUTTON_SINGLE,
  BUTTON_SKILL_CANCEL,
  BUTTON_WIDE_AREA,
} from '../constants/battle/skillSceneButton.js';
import {
  PORT,
  HOST,
  CLIENT_VERSION,
  DB1_NAME,
  DB1_USER,
  DB1_PASSWORD,
  DB1_HOST,
  DB1_PORT,
  DB2_NAME,
  DB2_USER,
  DB2_PASSWORD,
  DB2_HOST,
  DB2_PORT,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_USERNAME,
  REDIS_PASSWORD,
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
  REGION,
  AWS_TABLE_NAME,
  BULL_QUEUE_NAME,
  CHANNEL_NUMBER,
} from '../constants/env.js';
import {
  BOSS_ATTACK_RANGE,
  BOSS_ATTACK_SPEED,
  BOSS_DELAY_AFTER_ATTACK,
  BOSS_ID,
  BOSS_INIT_TRANSFORM,
  BOSS_TARGET_INTERVAL,
  BOSS_TARGET_INTERVAL_ID,
  DROP_ITEMS_QUANTITY,
  HATCHERY_DUNGEON_CODE,
  HATCHERY_SPAWN_AREA_POSITION,
  MAX_PLAYERS,
  SECOND_PHASE_BIND_TIME,
  SECOND_PHASE_BOSS_SPEED,
  THIRD_PHASE_COUNT_TIME,
} from '../constants/hatchery/sceneConfig.js';
import { PACKET_TYPE_LENGTH, TOTAL_LENGTH } from '../constants/header.js';
import {
  SCREENCOLOR_B,
  SCREENCOLOR_G,
  SCREENCOLOR_R,
  SCREENTEXTALIGNMENT_X,
  SCREENTEXTALIGNMENT_Y,
  TEXTCOLOR_B,
  TEXTCOLOR_G,
  TEXTCOLOR_R,
} from '../constants/screenText.js';
import { TOWN_SESSION_ID } from '../constants/session.js';
import {
  ITEM_TABLE_KEY,
  LEVEL_TABLE_KEY,
  MONSTER_TABLE_KEY,
  DUNGEON_TABLE_KEY,
  DUNGEON_MONSTER_TABLE_KEY,
} from '../constants/redisKey.js';
import { LOOKUP_INTERVAL } from '../constants/dynamoDB.js';
import { TOWN_SPAWN_AREA_POSTION } from '../constants/town/townSceneConfig.js';
import {
  MANA_COST,
  BUFF_CHARACTER_ATK,
  BUFF_CHARACTER_DEF,
  BUFF_CHARACTER_CRITRATE,
  BUFF_CHARACTER_CRITDMG,
} from '../constants/hatchery/skillManaConfig.js';

export const config = {
  server: {
    port: PORT,
    host: HOST,
    channel: CHANNEL_NUMBER,
    count: 3,
  },
  client: {
    version: CLIENT_VERSION,
  },
  packet: {
    totalLength: TOTAL_LENGTH,
    typeLength: PACKET_TYPE_LENGTH,
  },
  session: {
    townId: TOWN_SESSION_ID,
  },
  databases: {
    TOWN_MONSTER: {
      name: DB1_NAME,
      user: DB1_USER,
      password: DB1_PASSWORD,
      host: DB1_HOST,
      port: DB1_PORT,
    },
    TOWN_GAME: {
      name: DB2_NAME,
      user: DB2_USER,
      password: DB2_PASSWORD,
      host: DB2_HOST,
      port: DB2_PORT,
    },
  },
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
  },
  redisKey: {
    itemTable: ITEM_TABLE_KEY,
    monsterTable: MONSTER_TABLE_KEY,
    levelTable: LEVEL_TABLE_KEY,
    dungeonTable: DUNGEON_TABLE_KEY,
    dungeonMonsterTable: DUNGEON_MONSTER_TABLE_KEY,
  },
  sceneStatus: {
    message: SCENE_MESSAGE_WINDOW,
    action: SCENE_CHOOSE_ACTION,
    target: SCENE_CHOOSE_TARGET,
    playerAtk: SCENE_PLAYER_ATTACK,
    enemyAtk: SCENE_ENEMY_ATTACK,
    skill: SCENE_CHOOSE_SKILL_TYPE,
    targetSkill: SCENE_CHOOSE_TARGET_WITH_SKILL,
    monsterDead: SCENE_MONSTER_DEAD,
    getExp: SCENE_GET_EXP,
    goToTown: SCENE_GO_TO_TOWN,

    itemSelect: SCENE_ITEM_SELECT,
    itemUsing: SCENE_ITEM_USING,
    itemChoose: SCENE_ITEM_CHOOSE,
    itemDrop: SCENE_ITEM_DROP,

    gameOverWin: SCENE_GAME_OVER_WIN,
    gameOverLose: SCENE_GAME_OVER_LOSE,

    confirm: SCENE_CONFIRM,
  },
  actionButton: {
    attack: BUTTON_COMMON_ATTACK,
    skill: BUTTON_SKILL_ATTACK,
    runaway: BUTTON_RUNAWAY,
    item: BUTTON_ITEM,
  },
  confirmButton: {
    confirm: BUTTON_CONFIRM,
    cancel: BUTTON_CANCEL,
  },
  attackType: {
    normal: NORMAL_HIT,
    single: SINGLE_SKILL,
    wide: WIDE_AREA_SKILL,
  },
  skillButton: {
    single: BUTTON_SINGLE,
    wide: BUTTON_WIDE_AREA,
    cancel: BUTTON_SKILL_CANCEL,
  },
  screenTextAlignment: {
    x: SCREENTEXTALIGNMENT_X,
    y: SCREENTEXTALIGNMENT_Y,
  },
  textColor: {
    r: TEXTCOLOR_R,
    g: TEXTCOLOR_G,
    b: TEXTCOLOR_B,
  },
  screenColor: {
    r: SCREENCOLOR_R,
    g: SCREENCOLOR_G,
    b: SCREENCOLOR_B,
  },
  hatchery: {
    maxPlayers: MAX_PLAYERS,
    bossId: BOSS_ID,
    bossInitTransform: BOSS_INIT_TRANSFORM,
    bossTargetIntervalId: BOSS_TARGET_INTERVAL_ID,
    bossTargetInterval: BOSS_TARGET_INTERVAL,
    bossAttackRange: BOSS_ATTACK_RANGE,
    bossAttackSpeed: BOSS_ATTACK_SPEED,
    bossAttackDelay: BOSS_DELAY_AFTER_ATTACK,
    spawnAreaPos: HATCHERY_SPAWN_AREA_POSITION,
    dungeonCode: HATCHERY_DUNGEON_CODE,
    bindTime: SECOND_PHASE_BIND_TIME,
    updatedBossSpeed: SECOND_PHASE_BOSS_SPEED,
    deathCountTime: THIRD_PHASE_COUNT_TIME,
  },
  town: {
    spawnAreaPos: TOWN_SPAWN_AREA_POSTION,
  },
  battleScene: {
    maxLevel: PLAYER_MAX_LEVEL,
    respawnHp: RESPAWN_HP,
  },
  worldLevels: {
    1: WORLD_LEVEL_1_CONFIG,
    2: WORLD_LEVEL_2_CONFIG,
    3: WORLD_LEVEL_3_CONFIG,
    4: WORLD_LEVEL_4_CONFIG,
    5: WORLD_LEVEL_5_CONFIG,
  },
  levelThresholds: {
    level1: 5,
    level2: 10,
    level3: 15,
  },
  dropItem: {
    quantity: DROP_ITEMS_QUANTITY,
  },
  dynamoDB: {
    awsTableName: AWS_TABLE_NAME,
    awsRemoteConfig: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
      region: REGION,
    },
    lookupInterval: LOOKUP_INTERVAL,
  },
  bullQueue: {
    queueName: BULL_QUEUE_NAME,
  },

  skill: {
    manaCost: MANA_COST,
    atkBuff: BUFF_CHARACTER_ATK,
    defBuff: BUFF_CHARACTER_DEF,
    critRateBuff: BUFF_CHARACTER_CRITRATE,
    critDmgBuff: BUFF_CHARACTER_CRITDMG,
  },
};
