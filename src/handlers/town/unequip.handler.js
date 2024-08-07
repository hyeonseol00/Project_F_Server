import { getItemById } from '../../session/item.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import Item from '../../classes/models/item.class.js';

export const unquipHandler = (user, message) => {
  const { weapon, armor, gloves, shoes, accessory, critical, avoidAbility } = user;
  const { level, hp, maxHp, mp, maxMp, atk, def, magic, speed } = user.playerInfo.statInfo;

  let statInfo;
  switch (message) {
    case 'weapon':
      if (weapon !== 0) {
        const weaponInfo = getItemById(weapon);
        user.updateItemId('weapon', 0);

        statInfo = {
          level,
          hp: maxHp - weaponInfo.itemHp < hp ? maxHp - weaponInfo.itemHp : hp,
          maxHp: maxHp - weaponInfo.itemHp,
          mp: maxMp - weaponInfo.itemMp < mp ? maxMp - weaponInfo.itemMp : mp,
          maxMp: maxMp - weaponInfo.itemMp,
          atk: atk - weaponInfo.itemAttack,
          def: def - weaponInfo.itemDefense,
          magic: magic - weaponInfo.itemMagic,
          speed: speed - weaponInfo.itemSpeed,
        };

        const updateCritical = critical - weaponInfo.itemCritical;
        const updateAvoidAbility = avoidAbility - weaponInfo.itemAvoidance;

        user.updateStatInfo(statInfo);
        user.updateCriAvoid(updateCritical, updateAvoidAbility);

        const isInven = user.findItemByInven(weaponInfo.itemId);
        if (!isInven) {
          const item = new Item(1, weaponInfo);
          user.pushMountingItem(item);
        } else {
          user.addMountingItem(weaponInfo.itemId, 1);
        }

        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] ${weaponInfo.itemName} 장비를 해제했습니다.`,
        });
        user.socket.write(response);
        // S_UnequipWeapon 패킷 전송
        const unequipResponse = createResponse('response', 'S_UnequipWeapon', {
          itemType: 'weapon',
        });
        user.socket.write(unequipResponse);
      } else {
        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: '[System] 착용 중인 무기가 없습니다.',
        });
        user.socket.write(response);
      }
      break;
    case 'armor':
      if (armor !== 0) {
        const armorInfo = getItemById(armor);
        user.updateItemId('armor', 0);
        statInfo = {
          level,
          hp: maxHp - armorInfo.itemHp < hp ? maxHp - armorInfo.itemHp : hp,
          maxHp: maxHp - armorInfo.itemHp,
          mp: maxMp - armorInfo.itemMp < mp ? maxMp - armorInfo.itemMp : mp,
          maxMp: maxMp - armorInfo.itemMp,
          atk: atk - armorInfo.itemAttack,
          def: def - armorInfo.itemDefense,
          magic: magic - armorInfo.itemMagic,
          speed: speed - armorInfo.itemSpeed,
        };
        const updateCritical = critical - armorInfo.itemCritical;
        const updateAvoidAbility = avoidAbility - armorInfo.itemAvoidance;

        user.updateStatInfo(statInfo);
        user.updateCriAvoid(updateCritical, updateAvoidAbility);

        const isInven = user.findItemByInven(armorInfo.itemId);
        if (!isInven) {
          const item = new Item(1, armorInfo);
          user.pushMountingItem(item);
        } else {
          user.addMountingItem(armorInfo.itemId, 1);
        }

        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] ${armorInfo.itemName} 장비를 해제했습니다.`,
        });
        user.socket.write(response);
        // S_UnequipWeapon 패킷 전송
        const unequipResponse = createResponse('response', 'S_UnequipWeapon', {
          itemType: 'armor',
        });
        user.socket.write(unequipResponse);
      } else {
        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: '[System] 착용 중인 방어구가 없습니다.',
        });
        user.socket.write(response);
      }
      break;
    case 'gloves':
      if (gloves !== 0) {
        const glovesInfo = getItemById(gloves);
        user.updateItemId('gloves', 0);

        statInfo = {
          level,
          hp: maxHp - glovesInfo.itemHp < hp ? maxHp - glovesInfo.itemHp : hp,
          maxHp: maxHp - glovesInfo.itemHp,
          mp: maxMp - glovesInfo.itemMp < mp ? maxMp - glovesInfo.itemMp : mp,
          maxMp: maxMp - glovesInfo.itemMp,
          atk: atk - glovesInfo.itemAttack,
          def: def - glovesInfo.itemDefense,
          magic: magic - glovesInfo.itemMagic,
          speed: speed - glovesInfo.itemSpeed,
        };

        const updateCritical = critical - glovesInfo.itemCritical;
        const updateAvoidAbility = avoidAbility - glovesInfo.itemAvoidance;

        user.updateStatInfo(statInfo);
        user.updateCriAvoid(updateCritical, updateAvoidAbility);

        const isInven = user.findItemByInven(glovesInfo.itemId);
        if (!isInven) {
          const item = new Item(1, glovesInfo);
          user.pushMountingItem(item);
        } else {
          user.addMountingItem(glovesInfo.itemId, 1);
        }

        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] ${glovesInfo.itemName} 장비를 해제했습니다.`,
        });
        user.socket.write(response);
        // S_UnequipWeapon 패킷 전송
        const unequipResponse = createResponse('response', 'S_UnequipWeapon', {
          itemType: 'gloves',
        });
        user.socket.write(unequipResponse);
      } else {
        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: '[System] 착용 중인 장갑이 없습니다.',
        });
        user.socket.write(response);
      }
      break;
    case 'shoes':
      if (shoes !== 0) {
        const shoesInfo = getItemById(shoes);
        user.updateItemId('shoes', 0);

        statInfo = {
          level,
          hp: maxHp - shoesInfo.itemHp < hp ? maxHp - shoesInfo.itemHp : hp,
          maxHp: maxHp - shoesInfo.itemHp,
          mp: maxMp - shoesInfo.itemMp < mp ? maxMp - shoesInfo.itemMp : mp,
          maxMp: maxMp - shoesInfo.itemMp,
          atk: atk - shoesInfo.itemAttack,
          def: def - shoesInfo.itemDefense,
          magic: magic - shoesInfo.itemMagic,
          speed: speed - shoesInfo.itemSpeed,
        };

        const updateCritical = critical - shoesInfo.itemCritical;
        const updateAvoidAbility = avoidAbility - shoesInfo.itemAvoidance;

        user.updateStatInfo(statInfo);
        user.updateCriAvoid(updateCritical, updateAvoidAbility);

        const isInven = user.findItemByInven(shoesInfo.itemId);
        if (!isInven) {
          const item = new Item(1, shoesInfo);
          user.pushMountingItem(item);
        } else {
          user.addMountingItem(shoesInfo.itemId, 1);
        }

        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] ${shoesInfo.itemName} 장비를 해제했습니다.`,
        });
        user.socket.write(response);
        // S_UnequipWeapon 패킷 전송
        const unequipResponse = createResponse('response', 'S_UnequipWeapon', {
          itemType: 'shoes',
        });
        user.socket.write(unequipResponse);
      } else {
        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: '[System] 착용 중인 신발이 없습니다.',
        });
        user.socket.write(response);
      }
      break;
    case 'accessory':
      if (accessory !== 0) {
        const accessoryInfo = getItemById(accessory);
        user.updateItemId('accessory', 0);

        statInfo = {
          level,
          hp: maxHp - accessoryInfo.itemHp < hp ? maxHp - accessoryInfo.itemHp : hp,
          maxHp: maxHp - accessoryInfo.itemHp,
          mp: maxMp - accessoryInfo.itemMp < mp ? maxMp - accessoryInfo.itemMp : mp,
          maxMp: maxMp - accessoryInfo.itemMp,
          atk: atk - accessoryInfo.itemAttack,
          def: def - accessoryInfo.itemDefense,
          magic: magic - accessoryInfo.itemMagic,
          speed: speed - accessoryInfo.itemSpeed,
        };

        const updateCritical = critical - accessoryInfo.itemCritical;
        const updateAvoidAbility = avoidAbility - accessoryInfo.itemAvoidance;

        user.updateStatInfo(statInfo);
        user.updateCriAvoid(updateCritical, updateAvoidAbility);

        const isInven = user.findItemByInven(accessoryInfo.itemId);
        if (!isInven) {
          const item = new Item(1, accessoryInfo);
          user.pushMountingItem(item);
        } else {
          user.addMountingItem(accessoryInfo.itemId, 1);
        }

        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] ${accessoryInfo.itemName} 장비를 해제했습니다.`,
        });
        user.socket.write(response);
        // S_UnequipWeapon 패킷 전송
        const unequipResponse = createResponse('response', 'S_UnequipWeapon', {
          itemType: 'accessory',
        });
        user.socket.write(unequipResponse);
      } else {
        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: '[System] 착용 중인 장신구가 없습니다.',
        });
        user.socket.write(response);
      }
      break;
    default:
      break;
  }
};
