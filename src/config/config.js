import {
  BUTTON_COMMON_ATTACK,
  BUTTON_SKILL_ATTACK,
  BUTTON_RUNAWAY,
} from '../constants/battle/actionSceneButton.js';
import {
  SCENE_CHOOSE_TARGET,
  SCENE_MESSAGE_WINDOW,
  SCENE_CHOOSE_ACTION,
  SCENE_CONFIRM,
  SCENE_PLAYER_ATTACK,
  SCENE_ENEMY_ATTACK,
} from '../constants/battle/battleSceneStatus.js';
import { BUTTON_CONFIRM, BUTTON_CANCEL } from '../constants/battle/confirmSceneButton.js';
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
    confirm: SCENE_CONFIRM,
  },
  actionButton: {
    attack: BUTTON_COMMON_ATTACK,
    skill: BUTTON_SKILL_ATTACK,
    runaway: BUTTON_RUNAWAY,
  },
  confirmButton: {
    confirm: BUTTON_CONFIRM,
    cancel: BUTTON_CANCEL,
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
};
