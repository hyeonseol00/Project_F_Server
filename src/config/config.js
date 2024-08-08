import {
  BUTTON_COMMON_ATTACK,
  BUTTON_SKILL_ATTACK,
  BUTTON_RUNAWAY,
  BUTTON_ITEM,
} from '../constants/battle/actionSceneButton.js';
import { NORMAL_HIT, SINGLE_SKILL, WIDE_AREA_SKILL } from '../constants/battle/attackType.js';
import {
  PLAYER_MAX_LEVEL,
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
} from '../constants/env.js';
import {
  BOSS_ATTACK_RANGE,
  BOSS_ID,
  BOSS_INIT_TRANSFORM,
  BOSS_TARGET_INTERVAL,
  BOSS_TARGET_INTERVAL_ID,
  DROP_ITEMS_QUANTITY,
  MAX_PLAYERS,
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

export const config = {
  server: {
    port: PORT,
    host: HOST,
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
  },
  battleScene: {
    maxLevel: PLAYER_MAX_LEVEL,
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
};
