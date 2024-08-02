import { config } from '../../../config/config.js';
import { createResponse } from '../../../utils/response/createResponse.js';

export default function chooseActionScene(responseCode, dungeon, socket) {
  const btns = [];
  const player = dungeon.player;
  const playerStatInfo = player.playerInfo.statInfo;
  const attackType = dungeon.currentAttackType;

  switch (responseCode) {
    case config.actionButton.attack:
      for (let i = 0; i < dungeon.monsters.length; i++) {
        const monster = dungeon.monsters[i];
        btns.push({ msg: `${monster.name}`, enable: !monster.isDead });
      }
      const attackBattleLog = {
        msg: '공격할 몬스터를 선택하세요!',
        typingAnimation: false,
        btns,
      };

      const attackResponse = createResponse('response', 'S_BattleLog', {
        battleLog: attackBattleLog,
      });
      socket.write(attackResponse);

      if (attackType === config.attackType.single) {
        dungeon.battleSceneStatus = config.sceneStatus.targetSkill;
      } else {
        dungeon.battleSceneStatus = config.sceneStatus.target;
        dungeon.currentAttackType = config.attackType.normal;
      }
      break;
    case config.actionButton.skill:
      const playerMp = playerStatInfo.mp;
      btns.push({ msg: '단일 스킬', enable: playerMp >= 25 });
      btns.push({ msg: '광역 스킬', enable: playerMp >= 50 });
      btns.push({ msg: '취소', enable: true });
      const skillBattleLog = {
        msg: '스킬 타입을 선택하세요!',
        typingAnimation: false,
        btns,
      };

      const skillResponse = createResponse('response', 'S_BattleLog', {
        battleLog: skillBattleLog,
      });
      socket.write(skillResponse);

      dungeon.battleSceneStatus = config.sceneStatus.skill;
      break;
    case config.actionButton.runaway:
      btns.push({ msg: '확인', enable: true });
      btns.push({ msg: '취소', enable: true });
      const runawayBattleLog = {
        msg: '전투에서 도망칩니다!',
        typingAnimation: false,
        btns,
      };

      const runawayResponse = createResponse('response', 'S_BattleLog', {
        battleLog: runawayBattleLog,
      });
      socket.write(runawayResponse);

      dungeon.battleSceneStatus = config.sceneStatus.confirm;
      break;
    case config.actionButton.item:
      const items = player.potions;
      for (const item of items) {
        if (item.quantity < 1) btns.push({ msg: item.name + ` x0`, enable: false });
        else btns.push({ msg: item.name + ` x${item.quantity}`, enable: true });
      }
      btns.push({ msg: '취소', enable: true });
      const itemsBattleLog = {
        msg: '아이템을 선택하세요!',
        typingAnimation: false,
        btns,
      };
      const itemsResponse = createResponse('response', 'S_BattleLog', {
        battleLog: itemsBattleLog,
      });
      socket.write(itemsResponse);
      dungeon.battleSceneStatus = config.sceneStatus.itemSelect;
      break;
  }
}
