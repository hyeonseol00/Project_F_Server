import { setStatInfo, skillPointUpdate } from '../../../../classes/DBgateway/playerinfo.gateway.js';

export const updateAbility = async (socket, upAbility, statInfo, quantity, skillPoint) => {
  const upAbilityValue = 5;
  const updateStatInfo = {
    level: statInfo.level,
    hp: upAbility === 'hp' ? statInfo.hp + upAbilityValue * quantity : statInfo.hp,
    maxHp: upAbility === 'hp' ? statInfo.maxHp + upAbilityValue * quantity : statInfo.maxHp,
    mp: upAbility === 'mp' ? statInfo.mp + upAbilityValue * quantity : statInfo.mp,
    maxMp: upAbility === 'mp' ? statInfo.maxMp + upAbilityValue * quantity : statInfo.maxMp,
    atk: upAbility === 'atk' ? statInfo.atk + upAbilityValue * quantity : statInfo.atk,
    def: upAbility === 'def' ? statInfo.def + upAbilityValue * quantity : statInfo.def,
    magic: upAbility === 'magic' ? statInfo.magic + upAbilityValue * quantity : statInfo.magic,
    speed: upAbility === 'speed' ? statInfo.speed + upAbilityValue * quantity : statInfo.speed,
    critDmg: statInfo.critDmg,
    critRate: statInfo.critRate,
    avoidRate: statInfo.avoidRate,
    exp: statInfo.exp,
  };
  skillPoint -= quantity;

  await setStatInfo(socket, updateStatInfo);
  skillPointUpdate(socket, skillPoint);
};
