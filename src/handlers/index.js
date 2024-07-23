import { PACKET_TYPE } from '../constants/header.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import enterTownHandler from './town/enter.handler.js';
import moveTownHandler from './town/move.handler.js';

const handlers = {
  [PACKET_TYPE.C_Enter]: {
    handler: enterTownHandler,
    protoType: 'town.C_Enter',
  },
  [PACKET_TYPE.C_Move]:{
    handler: moveTownHandler,
    protoType: 'town.C_Move',
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
