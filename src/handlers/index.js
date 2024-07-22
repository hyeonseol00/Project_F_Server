import { PACKET_TYPE } from '../constants/header.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import joinGameHandler from './game/joinGame.handler.js';
import updateLocationHandler from './game/updateLocation.handler.js';
import enterTownHandler from './town/enter.handler.js';
import initialHandler from './user/initial.handler.js';

const handlers = {
  /* 
  [HANDLER_IDS.INITIAL]: {
    handler: initialHandler,
    protoType: 'initial.InitialPacket',
  },
  [HANDLER_IDS.CREATE_GAME]: {
    handler: createGameHandler,
    protoType: 'game.CreateGamePayload',
  },
  [HANDLER_IDS.JOIN_GAME]: {
    handler: joinGameHandler,
    protoType: 'game.JoinGamePayload',
  },
  [HANDLER_IDS.UPDATE_LOCATION]: {
    handler: updateLocationHandler,
    protoType: 'game.LocationUpdatePayload',
	},
   */
  [PACKET_TYPE.C_Enter]: {
    handler: enterTownHandler,
    protoType: 'town.C_Enter',
  },
};

export const getHandlerById = (handlerId) => {
  if (!handlers[handlerId])
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${handlerId}`,
    );

  return handlers[handlerId].handler;
};

export const getProtoTypeNameByHandlerId = (handlerId) => {
  if (!handlers[handlerId])
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `프로토타입을 찾을 수 없습니다: ID ${handlerId}`,
    );

  return handlers[handlerId].protoType;
};
