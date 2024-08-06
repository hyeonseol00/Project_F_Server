import { getItemById } from '../../session/item.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import Item from '../../classes/models/item.class.js';

function isInteger(s) {
  s += ''; // 문자열로 변환
  s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
  if (s === '' || isNaN(s)) return false; // 빈 문자열이거나 숫자가 아닌 경우 false 반환

  const num = Number(s);
  return Number.isInteger(num); // 정수인지 확인
}

export const equipHandler = (user, message) => {
  const { weapon, armor, gloves, shoes, accessory, critical, avoidAbility } = user;
  const { level, hp, maxHp, mp, maxMp, atk, def, magic, speed } = user.playerInfo.statInfo;

  // TEST--------------------------------------------------------
  // const item = {
  //   id: 1,
  //   quantity: 123
  // };

  // const test1Response = createResponse('response', 'S_BuyItem', {
  //   item,
  //   success: true
  // });
  // user.socket.write(test1Response);

  // const test2Response = createResponse('response', 'S_SellItem', {
  //   item,
  //   success: true
  // });
  // user.socket.write(test2Response);

  // const test3Response = createResponse('response', 'S_UseItem', {
  //   itemId : 1,
  //   success: true
  // });
  // user.socket.write(test3Response);

  // const test4Response = createResponse('response', 'S_EquipWeapon', {
  //   itemId: 1,
  //   success: true
  // });
  // user.socket.write(test4Response);

  // console.log(test4Response);

  // const type = "weapon";

  // const test5Response = createResponse('response', 'S_UnequipWeapon', {
  //   itemType: type,
  //   success: true
  // });
  // user.socket.write(test5Response);

  // console.log(test5Response);

  // TEST--------------------------------------------------------
  if (!isInteger(message)) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 아이템 ID(숫자)를(를) 입력하세요.`,
    });
    user.socket.write(response);
    return;
  }

  if (Number(message) <= 0) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 정확한 아이템ID를 입력하세요. `,
    });
    user.socket.write(response);
    return;
  }

  const isItemByTable = getItemById(Number(message));
  const findItem = user.findItemByInven(Number(message));
  if (!isItemByTable) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: '[System] 없는 아이템 입니다.',
    });
    user.socket.write(response);

    return;
  } else if (!findItem) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] ${user.nickname}의 인벤토리에 아이템이 존재하지 않습니다.`,
    });
    user.socket.write(response);

    return;
  }

  const {
    itemId,
    itemType,
    name,
    quantity,
    requireLevel,
    addHp,
    addMp,
    addAttack,
    addDefense,
    addMagic,
    addSpeed,
    addAvoidance,
    addCritical,
  } = findItem;

  if (level < requireLevel) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] ${name} 장비는 레벨 ${requireLevel} 이상만 착용할 수 있습니다.`,
    });
    user.socket.write(response);

    return;
  }

  let statInfo;
  switch (itemType) {
    case 'weapon':
      if (weapon !== 0) {
        const curWeaponInfo = getItemById(weapon);
        user.updateItemId(itemType, itemId);

        statInfo = {
          level,
          hp: maxHp + addHp - curWeaponInfo.itemHp < hp ? maxHp + addHp - curWeaponInfo.itemHp : hp,
          maxHp: maxHp + addHp - curWeaponInfo.itemHp,
          mp: maxMp + addMp - curWeaponInfo.itemMp < mp ? maxMp + addMp - curWeaponInfo.itemMp : mp,
          maxMp: maxMp + addMp - curWeaponInfo.itemMp,
          atk: atk + addAttack - curWeaponInfo.itemAttack,
          def: def + addDefense - curWeaponInfo.itemDefense,
          magic: magic + addMagic - curWeaponInfo.itemMagic,
          speed: speed + addSpeed - curWeaponInfo.itemSpeed,
        };

        const updateCritical = critical + addCritical - curWeaponInfo.itemCritical;
        const updateAvoidAbility = avoidAbility + addAvoidance - curWeaponInfo.itemAvoidance;

        user.updateStatInfo(statInfo);
        user.updateCriAvoid(updateCritical, updateAvoidAbility);

        const isInven = user.findItemByInven(weapon);
        const itemInfo = getItemById(weapon);
        if (!isInven) {
          const item = new Item(
            itemInfo.itemId,
            itemInfo.itemType,
            itemInfo.itemName,
            itemInfo.itemHp,
            itemInfo.itemMp,
            itemInfo.requireLevel,
            1,
            itemInfo,
          );
          user.pushMountingItem(item);
          if (user.getItemQuantity(itemId) === 1) {
            user.deleteMountingItem(itemId);
          } else {
            user.decMountingItem(itemId, 1);
          }
        } else {
          user.addMountingItem(isInven.itemId, 1);
          if (user.getItemQuantity(itemId) === 1) {
            user.deleteMountingItem(itemId);
          } else {
            user.decMountingItem(itemId, 1);
          }
        }

        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] ${curWeaponInfo.itemName}을(를) 해제하고 ${name}을(를) 장착했습니다.`,
        });
        user.socket.write(response);
      } else {
        user.updateItemId(itemType, itemId);

        statInfo = {
          level,
          hp: hp,
          maxHp: maxHp + addHp,
          mp: mp,
          maxMp: maxMp + addMp,
          atk: atk + addAttack,
          def: def + addDefense,
          magic: magic + addMagic,
          speed: speed + addSpeed,
        };

        const updateCritical = critical + addCritical;
        const updateAvoidAbility = avoidAbility + addAvoidance;

        user.updateStatInfo(statInfo);
        user.updateCriAvoid(updateCritical, updateAvoidAbility);

        if (user.getItemQuantity(itemId) === 1) {
          user.deleteMountingItem(itemId);
        } else {
          user.decMountingItem(itemId, 1);
        }

        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] ${name}을(를) 장착했습니다.`,
        });
        user.socket.write(response);

      }
      break;
    case 'armor':
      if (armor !== 0) {
        const curArmorInfo = getItemById(armor);
        user.updateItemId(itemType, itemId);

        statInfo = {
          level,
          hp: maxHp + addHp - curArmorInfo.itemHp < hp ? maxHp + addHp - curArmorInfo.itemHp : hp,
          maxHp: maxHp + addHp - curArmorInfo.itemHp,
          mp: maxMp + addMp - curArmorInfo.itemMp < mp ? maxMp + addMp - curArmorInfo.itemMp : mp,
          maxMp: maxMp + addMp - curArmorInfo.itemMp,
          atk: atk + addAttack - curArmorInfo.itemAttack,
          def: def + addDefense - curArmorInfo.itemDefense,
          magic: magic + addMagic - curArmorInfo.itemMagic,
          speed: speed + addSpeed - curArmorInfo.itemSpeed,
        };

        const updateCritical = critical + addCritical - curArmorInfo.itemCritical;
        const updateAvoidAbility = avoidAbility + addAvoidance - curArmorInfo.itemAvoidance;

        user.updateStatInfo(statInfo);
        user.updateCriAvoid(updateCritical, updateAvoidAbility);

        const isInven = user.findItemByInven(armor);
        const itemInfo = getItemById(armor);
        if (!isInven) {
          const item = new Item(
            itemInfo.itemId,
            itemInfo.itemType,
            itemInfo.itemName,
            itemInfo.itemHp,
            itemInfo.itemMp,
            itemInfo.requireLevel,
            1,
            itemInfo,
          );
          user.pushMountingItem(item);
          if (user.getItemQuantity(itemId) === 1) {
            user.deleteMountingItem(itemId);
          } else {
            user.decMountingItem(itemId, 1);
          }
        } else {
          user.addMountingItem(isInven.itemIdm, 1);
          if (user.getItemQuantity(itemId) === 1) {
            user.deleteMountingItem(itemId);
          } else {
            user.decMountingItem(itemId, 1);
          }
        }

        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] ${curArmorInfo.itemName}을(를) 해제하고 ${name}을(를) 장착했습니다.`,
        });
        user.socket.write(response);
      } else {
        user.updateItemId(itemType, itemId);

        statInfo = {
          level,
          hp: hp,
          maxHp: maxHp + addHp,
          mp: mp,
          maxMp: maxMp + addMp,
          atk: atk + addAttack,
          def: def + addDefense,
          magic: magic + addMagic,
          speed: speed + addSpeed,
        };

        const updateCritical = critical + addCritical;
        const updateAvoidAbility = avoidAbility + addAvoidance;

        user.updateStatInfo(statInfo);
        user.updateCriAvoid(updateCritical, updateAvoidAbility);

        if (user.getItemQuantity(itemId) === 1) {
          user.deleteMountingItem(itemId);
        } else {
          user.decMountingItem(itemId, 1);
        }

        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] ${name}을(를) 장착했습니다.`,
        });
        user.socket.write(response);
      }
      break;
    case 'gloves':
      if (gloves !== 0) {
        const curGlovesInfo = getItemById(gloves);
        user.updateItemId(itemType, itemId);
        statInfo = {
          level,
          hp: maxHp + addHp - curGlovesInfo.itemHp < hp ? maxHp + addHp - curGlovesInfo.itemHp : hp,
          maxHp: maxHp + addHp - curGlovesInfo.itemHp,
          mp: maxMp + addMp - curGlovesInfo.itemMp < mp ? maxMp + addMp - curGlovesInfo.itemMp : mp,
          maxMp: maxMp + addMp - curGlovesInfo.itemMp,
          atk: atk + addAttack - curGlovesInfo.itemAttack,
          def: def + addDefense - curGlovesInfo.itemDefense,
          magic: magic + addMagic - curGlovesInfo.itemMagic,
          speed: speed + addSpeed - curGlovesInfo.itemSpeed,
          critical: critical + addCritical - curGlovesInfo.itemCritical,
          avoidAbility: avoidAbility + addAvoidance - curGlovesInfo.itemAvoidance,
        };

        const updateCritical = critical + addCritical - curGlovesInfo.itemCritical;
        const updateAvoidAbility = avoidAbility + addAvoidance - curGlovesInfo.itemAvoidance;

        user.updateStatInfo(statInfo);
        user.updateCriAvoid(updateCritical, updateAvoidAbility);

        const isInven = user.findItemByInven(gloves);
        const itemInfo = getItemById(gloves);
        if (!isInven) {
          const item = new Item(
            itemInfo.itemId,
            itemInfo.itemType,
            itemInfo.itemName,
            itemInfo.itemHp,
            itemInfo.itemMp,
            itemInfo.requireLevel,
            1,
            itemInfo,
          );
          user.pushMountingItem(item);
          if (user.getItemQuantity(itemId) === 1) {
            user.deleteMountingItem(itemId);
          } else {
            user.decMountingItem(itemId, 1);
          }
        } else {
          user.addMountingItem(isInven.itemId, 1);
          if (user.getItemQuantity(itemId) === 1) {
            user.deleteMountingItem(itemId);
          } else {
            user.decMountingItem(itemId, 1);
          }
        }

        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] ${curGlovesInfo.itemName}을(를) 해제하고 ${name}을(를) 장착했습니다.`,
        });
        user.socket.write(response);
      } else {
        user.updateItemId(itemType, itemId);

        statInfo = {
          level,
          hp: hp,
          maxHp: maxHp + addHp,
          mp: mp,
          maxMp: maxMp + addMp,
          atk: atk + addAttack,
          def: def + addDefense,
          magic: magic + addMagic,
          speed: speed + addSpeed,
          critical: critical + addCritical,
          avoidAbility: avoidAbility + addAvoidance,
        };

        const updateCritical = critical + addCritical;
        const updateAvoidAbility = avoidAbility + addAvoidance;

        user.updateStatInfo(statInfo);
        user.updateCriAvoid(updateCritical, updateAvoidAbility);

        if (user.getItemQuantity(itemId) === 1) {
          user.deleteMountingItem(itemId);
        } else {
          user.decMountingItem(itemId, 1);
        }

        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] ${name}을(를) 장착했습니다.`,
        });
        user.socket.write(response);
      }
      break;
    case 'shoes':
      if (shoes !== 0) {
        const curShoesInfo = getItemById(shoes);
        user.updateItemId(itemType, itemId);

        statInfo = {
          level,
          hp: maxHp + addHp - curShoesInfo.itemHp < hp ? maxHp + addHp - curShoesInfo.itemHp : hp,
          maxHp: maxHp + addHp - curShoesInfo.itemHp,
          mp: maxMp + addMp - curShoesInfo.itemMp < mp ? maxMp + addMp - curShoesInfo.itemMp : mp,
          maxMp: maxMp + addMp - curShoesInfo.itemMp,
          atk: atk + addAttack - curShoesInfo.itemAttack,
          def: def + addDefense - curShoesInfo.itemDefense,
          magic: magic + addMagic - curShoesInfo.itemMagic,
          speed: speed + addSpeed - curShoesInfo.itemSpeed,
          critical: critical + addCritical - curShoesInfo.itemCritical,
          avoidAbility: avoidAbility + addAvoidance - curShoesInfo.itemAvoidance,
        };

        const updateCritical = critical + addCritical - curShoesInfo.itemCritical;
        const updateAvoidAbility = avoidAbility + addAvoidance - curShoesInfo.itemAvoidance;

        user.updateStatInfo(statInfo);
        user.updateCriAvoid(updateCritical, updateAvoidAbility);

        const isInven = user.findItemByInven(shoes);
        const itemInfo = getItemById(shoes);
        if (!isInven) {
          const item = new Item(
            itemInfo.itemId,
            itemInfo.itemType,
            itemInfo.itemName,
            itemInfo.itemHp,
            itemInfo.itemMp,
            itemInfo.requireLevel,
            1,
            itemInfo,
          );
          user.pushMountingItem(item);
          if (user.getItemQuantity(itemId) === 1) {
            user.deleteMountingItem(itemId);
          } else {
            user.decMountingItem(itemId, 1);
          }
        } else {
          user.addMountingItem(isInven.itemId, 1);
          if (user.getItemQuantity(itemId) === 1) {
            user.deleteMountingItem(itemId);
          } else {
            user.decMountingItem(itemId, 1);
          }
        }

        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] ${curShoesInfo.itemName}을(를) 해제하고 ${name}을(를) 장착했습니다.`,
        });
        user.socket.write(response);
      } else {
        user.updateItemId(itemType, itemId);

        statInfo = {
          level,
          hp: hp,
          maxHp: maxHp + addHp,
          mp: mp,
          maxMp: maxMp + addMp,
          atk: atk + addAttack,
          def: def + addDefense,
          magic: magic + addMagic,
          speed: speed + addSpeed,
          critical: critical + addCritical,
          avoidAbility: avoidAbility + addAvoidance,
        };

        const updateCritical = critical + addCritical;
        const updateAvoidAbility = avoidAbility + addAvoidance;

        user.updateStatInfo(statInfo);
        user.updateCriAvoid(updateCritical, updateAvoidAbility);

        if (user.getItemQuantity(itemId) === 1) {
          user.deleteMountingItem(itemId);
        } else {
          user.decMountingItem(itemId, 1);
        }

        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] ${name}을(를) 장착했습니다.`,
        });
        user.socket.write(response);
      }
      break;
    case 'accessory':
      if (accessory !== 0) {
        const curAccessoryInfo = getItemById(accessory);
        user.updateItemId(itemType, itemId);

        statInfo = {
          level,
          hp:
            maxHp + addHp - curAccessoryInfo.itemHp < hp
              ? maxHp + addHp - curAccessoryInfo.itemHp
              : hp,
          maxHp: maxHp + addHp - curAccessoryInfo.itemHp,
          mp:
            maxMp + addMp - curAccessoryInfo.itemMp < mp
              ? maxMp + addMp - curAccessoryInfo.itemMp
              : mp,
          maxMp: maxMp + addMp - curAccessoryInfo.itemMp,
          atk: atk + addAttack - curAccessoryInfo.itemAttack,
          def: def + addDefense - curAccessoryInfo.itemDefense,
          magic: magic + addMagic - curAccessoryInfo.itemMagic,
          speed: speed + addSpeed - curAccessoryInfo.itemSpeed,
          critical: critical + addCritical - curAccessoryInfo.itemCritical,
          avoidAbility: avoidAbility + addAvoidance - curAccessoryInfo.itemAvoidance,
        };

        const updateCritical = critical + addCritical - curAccessoryInfo.itemCritical;
        const updateAvoidAbility = avoidAbility + addAvoidance - curAccessoryInfo.itemAvoidance;

        user.updateStatInfo(statInfo);
        user.updateCriAvoid(updateCritical, updateAvoidAbility);

        const isInven = user.findItemByInven(accessory);
        const itemInfo = getItemById(accessory);
        if (!isInven) {
          const item = new Item(
            itemInfo.itemId,
            itemInfo.itemType,
            itemInfo.itemName,
            itemInfo.itemHp,
            itemInfo.itemMp,
            itemInfo.requireLevel,
            1,
            itemInfo,
          );
          user.pushMountingItem(item);
          if (user.getItemQuantity(itemId) === 1) {
            user.deleteMountingItem(itemId);
          } else {
            user.decMountingItem(itemId, 1);
          }
        } else {
          user.addMountingItem(isInven.itemId, 1);
          if (user.getItemQuantity(itemId) === 1) {
            user.deleteMountingItem(itemId);
          } else {
            user.decMountingItem(itemId, 1);
          }
        }

        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] ${curAccessoryInfo.itemName}을(를) 해제하고 ${name}을(를) 장착했습니다.`,
        });
        user.socket.write(response);
      } else {
        user.updateItemId(itemType, itemId);

        statInfo = {
          level,
          hp: hp,
          maxHp: maxHp + addHp,
          mp: mp,
          maxMp: maxMp + addMp,
          atk: atk + addAttack,
          def: def + addDefense,
          magic: magic + addMagic,
          speed: speed + addSpeed,
          critical: critical + addCritical,
          avoidAbility: avoidAbility + addAvoidance,
        };

        const updateCritical = critical + addCritical;
        const updateAvoidAbility = avoidAbility + addAvoidance;

        user.updateStatInfo(statInfo);
        user.updateCriAvoid(updateCritical, updateAvoidAbility);

        if (user.getItemQuantity(itemId) === 1) {
          user.deleteMountingItem(itemId);
        } else {
          user.decMountingItem(itemId, 1);
        }

        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] ${name}을(를) 장착했습니다.`,
        });
        user.socket.write(response);
      }
      break;
    default:
      break;
  }
};
