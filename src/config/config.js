import { CHOOSE_TARGET, MESSAGE_WINDOW } from '../constants/battleSceneStatus.js';
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
    message: MESSAGE_WINDOW,
    target: CHOOSE_TARGET,
  },
};
