import { PACKET_TYPE } from '../constants/header.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import battleResponseHandler from './battle/battleResponse.handler.js';
import enterTownHandler from './town/enter.handler.js';
import enterDungeonHandler from './town/enterDungeon.handler.js';
import animHandler from './town/anim.handler.js';
import chatHandler from './town/chat.handler.js';

const handlers = {
  [PACKET_TYPE.C_Enter]: {
    handler: enterTownHandler,
    protoType: 'town.C_Enter',
  },
  [PACKET_TYPE.C_EnterDungeon]: {
    handler: enterDungeonHandler,
    protoType: 'town.C_EnterDungeon',
  },
  [PACKET_TYPE.C_PlayerResponse]: {
    handler: battleResponseHandler,
    protoType: 'battle.C_PlayerResponse',
  },
  [PACKET_TYPE.C_Animation]: {
    handler: animHandler,
    protoType: 'town.C_Animation',
  },
  [PACKET_TYPE.C_Chat]: {
    handler: chatHandler,
    protoType: 'town.C_Chat',
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
