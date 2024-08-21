import { createResponse } from '../../../../utils/response/createResponse.js';
import { config } from '../../../../config/config.js';
import { getLevelById } from '../../../../assets/level.assets.js';
import {
  getPlayerInfo,
  setGold,
  setStatInfo,
  setWorldLevel,
  skillPointUpdate,
} from '../../../../classes/DBgateway/playerinfo.gateway.js';
import { getUserBySocket } from '../../../../session/user.session.js';

export default async function getExpScene(responseCode, dungeon, socket) {
  if (responseCode === 1) {
    const btns = [{ msg: '다음', enable: true }];
    let battleLog = {};

    const user = getUserBySocket(socket);
    const playerInfo = await getPlayerInfo(socket);
    const playerLevel = playerInfo.statInfo.level; // 유저의 현재 레벨

    let levelTable;
    if (playerLevel < config.battleScene.maxLevel) {
      levelTable = await getLevelById(playerLevel + 1);
    } else {
      levelTable = await getLevelById(1);
    }
    const {
      requiredExp,
      hp,
      mp,
      attack,
      defense,
      magic,
      speed,
      critical,
      criticalAttack,
      avoidAbility,
      skillPoint,
    } = levelTable;

    let monsterExp = 0;
    let gold = 0;
    for (let i = 0; i < dungeon.monsters.length; i++) {
      const monster = dungeon.monsters[i];
      monsterExp += monster.exp;
      gold += monster.gold;
    }
    const playerExp = monsterExp + playerInfo.statInfo.exp;
    // 현재 경험치가 필요 경험치보다 높을 경우 와 현재 레벨이 최고 레벨보다 작을 경우
    if (requiredExp <= playerExp && playerLevel < config.battleScene.maxLevel) {
      const statInfo = {
        level: playerLevel + 1,
        exp: playerExp - requiredExp,
        maxHp: playerInfo.statInfo.maxHp + hp,
        maxMp: playerInfo.statInfo.maxMp + mp,
        hp: playerInfo.statInfo.maxHp + hp,
        mp: playerInfo.statInfo.maxMp + mp,
        atk: playerInfo.statInfo.atk + attack,
        def: playerInfo.statInfo.def + defense,
        magic: playerInfo.statInfo.magic + magic,
        speed: playerInfo.statInfo.speed + speed,
        critRate: playerInfo.statInfo.critRate + critical,
        critDmg: playerInfo.statInfo.critDmg + criticalAttack,
        avoidRate: playerInfo.statInfo.avoidRate + avoidAbility,
      };
      await setStatInfo(socket, statInfo);
      await setGold(socket, playerInfo.gold + gold);
      skillPointUpdate(socket, user.skillPoint + skillPoint);

      if ((playerLevel + 1) % 5 === 0) {
        setWorldLevel(socket, user.worldLevel + 1);
      }

      const message = `경험치 ${monsterExp}, 골드 ${gold}, 스킬포인트 ${skillPoint}를 획득했습니다!\n
레벨 ${playerLevel + 1}이 되었습니다!\n
최대체력 +${hp} , 최대마나 +${mp}가 증가되었습니다!\n
공격력 +${attack} , 방어력 +${defense} , 마력 +${magic} , 스피드 +${speed}이 증가되었습니다!`;

      battleLog = {
        msg: message,
        typingAnimation: false,
        btns,
      };
    } else {
      const statInfo = {
        level: playerLevel,
        maxHp: playerInfo.statInfo.maxHp,
        maxMp: playerInfo.statInfo.maxMp,
        hp: playerInfo.statInfo.hp,
        mp: playerInfo.statInfo.mp,
        atk: playerInfo.statInfo.atk,
        def: playerInfo.statInfo.def,
        magic: playerInfo.statInfo.magic,
        speed: playerInfo.statInfo.speed,
        critRate: playerInfo.statInfo.critRate,
        critDmg: playerInfo.statInfo.critDmg,
        avoidRate: playerInfo.statInfo.avoidRate,
        exp: playerExp + monsterExp,
      };

      await setStatInfo(socket, statInfo);
      await setGold(socket, playerInfo.gold + gold);

      battleLog = {
        msg: `경험치 ${monsterExp}, 골드 ${gold}를 획득했습니다!`,
        typingAnimation: false,
        btns,
      };
    }

    const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });

    socket.write(responseBattleLog);

    dungeon.battleSceneStatus = config.sceneStatus.itemChoose;
  }
}
