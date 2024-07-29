import { config } from '../../config/config.js';
import { getDungeonByUserId } from '../../session/dungeon.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import chooseActionScene from './battleFlows/action.battle.js';
import messageWindowScene from './battleFlows/message.battle.js';
import confirmScene from './battleFlows/confirm.battle.js';
import targetMonsterScene from './battleFlows/target.battle.js';
import playerAttackScene from './battleFlows/playerAttack.battle.js';
import chooseSkillTypeScene from './battleFlows/skill.battle.js';
import monsterAttackScene from './battleFlows/monsterAttack.battle.js';
import monsterDeadScene from './battleFlows/monsterDead.battle.js';
import gameOverWinScene from './battleFlows/gameOverWin.battle.js';
import gameOverLoseScene from './battleFlows/gameOverLose.battle.js';
import selectItemScene from './battleFlows/selectItem.battle.js';
import usingItemScene from './battleFlows/usingItem.battle.js';

const battleResponseHandler = ({ socket, payload }) => {
  const user = getUserBySocket(socket);
  const dungeon = getDungeonByUserId(user.nickname);
  const responseCode = payload.responseCode ? payload.responseCode : 0;

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
      targetMonsterScene(responseCode, dungeon, socket);
      break;
    case config.sceneStatus.playerAtk:
      playerAttackScene(responseCode, dungeon, socket);
      break;
    case config.sceneStatus.enemyAtk:
      monsterAttackScene(responseCode, dungeon, socket);
      break;
    case config.sceneStatus.skill:
      chooseSkillTypeScene(responseCode, dungeon, socket);
      break;
    case config.sceneStatus.monsterDead:
      monsterDeadScene(responseCode, dungeon, socket);
      break;
    case config.sceneStatus.gameOverWin:
      gameOverWinScene(responseCode, dungeon, socket);
      break;
    case config.sceneStatus.gameOverLose:
      gameOverLoseScene(responseCode, dungeon, socket);
      break;
    case config.sceneStatus.confirm:
      confirmScene(responseCode, dungeon, user.nickname, socket);
      break;
    case config.sceneStatus.itemSelect:
      selectItemScene(responseCode, dungeon, socket);
      break;
    case config.sceneStatus.itemUsing:
      usingItemScene(responseCode, dungeon, socket);
      break;
  }
};

export default battleResponseHandler;
