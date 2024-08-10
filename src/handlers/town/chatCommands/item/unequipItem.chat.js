import { createResponse } from '../../../../utils/response/createResponse.js';
import { getAllUsersInTeam, getUserByNickname } from '../../../../session/user.session.js';
import isInteger from '../../../../utils/isInteger.js';
import updateEquip from '../../../../utils/equip.js';
import updateUnEquip from '../../../../utils/unequip.js';
import { getItemById } from '../../../../assets/item.assets.js';
import Item from '../../../../classes/models/item.class.js';

export const unequipItem = (user, message) => {
    const { weapon, armor, gloves, shoes, accessory } = user.equipment;
    console.log(user.equipment);
  
    switch (message) {
      case 'weapon':
        if (weapon !== 0) {
          updateUnEquip(weapon, user);
  
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
          updateUnEquip(armor, user);
  
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
          updateUnEquip(gloves, user);
  
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
          updateUnEquip(shoes, user);
  
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
          updateUnEquip(accessory, user);
  
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