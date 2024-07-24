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
} from '../constants/env.js';
import { PACKET_TYPE_LENGTH, TOTAL_LENGTH } from '../constants/header.js';
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
};
