import { config } from '../../config/config.js';
import { getDungeonByUserId } from '../../session/dungeon.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import chooseActionScene from './battleFlows/action.battle.js';
import messageWindowScene from './battleFlows/message.battle.js';
import confirmScene from './battleFlows/confirm.battle.js';
import targetMonsterScene from './battleFlows/target.battle.js';
import playerAttackScene from './battleFlows/playerAttack.battle.js';
import chooseSkillType from './battleFlows/skill.battle.js';

const battleResponseHandler = async ({ socket, payload }) => {
  const user = getUserBySocket(socket);
  const dungeon = getDungeonByUserId(user.nickname);
  const responseCode = payload.responseCode ? payload.responseCode : 0;

  console.log('responseCode: ', responseCode);
  switch (dungeon.battleSceneStatus) {
    case config.sceneStatus.message:
      messageWindowScene(responseCode, dungeon, socket);
      break;
    case config.sceneStatus.action:
      chooseActionScene(responseCode, dungeon, socket);
      break;
    case config.sceneStatus.target:
      targetMonsterScene(responseCode, dungeon, socket);
      break;
    case config.sceneStatus.targetSkill:
      targetMonsterScene(responseCode, dungeon, socket, true);
      break;
    case config.sceneStatus.playerAtk:
      playerAttackScene(responseCode, dungeon, socket);
      break;
    case config.sceneStatus.enemyAtk:
      break;
    case config.sceneStatus.confirm:
      confirmScene(responseCode, dungeon, user.nickname, socket);
      break;
    case config.sceneStatus.skill:
      chooseSkillType(responseCode, dungeon, socket);
      break;
  }
  console.log('battleSceneStatus: ', dungeon.battleSceneStatus);
};

export default battleResponseHandler;
