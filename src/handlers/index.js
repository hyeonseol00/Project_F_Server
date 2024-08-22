import { PACKET_TYPE } from '../constants/header.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import battleResponseHandler from './battle/battleResponse.handler.js';
import enterTownHandler from './town/enter.handler.js';
import moveTownHandler from './town/move.handler.js';
import enterDungeonHandler from './town/enterDungeon.handler.js';
import animHandler from './town/anim.handler.js';
import chatHandler from './town/chat.handler.js';
import registerHandler from './town/register.handler.js';
import loginHandler from './town/login.handler.js';
import enterHatcheryHandler from './town/enterHatchery.handler.js';
import moveHatcheryHandler from './hatchery/move.handler.js';
import tryAttackHatcheryHandler from './hatchery/tryAttack.handler.js';
import attackBossHatcheryHandler from './hatchery/attackBoss.handler.js';
import leaveHatcheryHandler from './hatchery/leaveHatchery.handler.js';
import playerHitHatcheryHandler from './hatchery/playerHit.handler.js';
import { usePotionHandler } from './hatchery/usePotion.handler.js';
import hatcherySelectRewardHandler from './hatchery/hatcherySelectReward.handler.js';

const handlers = {
  [PACKET_TYPE.C_Enter]: {
    handler: enterTownHandler,
    protoType: 'town.C_Enter',
  },
  [PACKET_TYPE.C_Move]: {
    handler: moveTownHandler,
    protoType: 'town.C_Move',
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
  [PACKET_TYPE.C_Register]: {
    handler: registerHandler,
    protoType: 'town.C_Register',
  },
  [PACKET_TYPE.C_LogIn]: {
    handler: loginHandler,
    protoType: 'town.C_LogIn',
  },
  [PACKET_TYPE.C_EnterHatchery]: {
    handler: enterHatcheryHandler,
    protoType: 'town.C_EnterHatchery',
  },
  [PACKET_TYPE.C_MoveAtHatchery]: {
    handler: moveHatcheryHandler,
    protoType: 'hatchery.C_MoveAtHatchery',
  },
  [PACKET_TYPE.C_TryAttack]: {
    handler: tryAttackHatcheryHandler,
    protoType: 'hatchery.C_TryAttack',
  },
  [PACKET_TYPE.C_AttackBoss]: {
    handler: attackBossHatcheryHandler,
    protoType: 'hatchery.C_AttackBoss',
  },
  [PACKET_TYPE.C_LeaveHatchery]: {
    handler: leaveHatcheryHandler,
    protoType: 'hatchery.C_LeaveHatchery',
  },
  [PACKET_TYPE.C_PlayerHit]: {
    handler: playerHitHatcheryHandler,
    protoType: 'hatchery.C_PlayerHit',
  },
  [PACKET_TYPE.C_TryUsePotion]: {
    handler: usePotionHandler,
    protoType: 'hatchery.C_TryUsePotion',
  },
  [PACKET_TYPE.C_HatcherySelectReward]: {
    handler: hatcherySelectRewardHandler,
    protoType: 'hatchery.C_HatcherySelectReward',
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
