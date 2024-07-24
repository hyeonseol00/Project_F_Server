import { config } from '../../config/config.js';

class User {
  constructor(playerId, nickname, characterClass, socket, hp, mp, attack, defense, magic, speed) {
    this.playerId = playerId;
    this.nickname = nickname;
    this.characterClass = characterClass;
    this.socket = socket;
    this.lastUpdateTime = Date.now();
    this.battleSceneStatus = config.sceneStatus.message;

    this.hp = hp;
    this.mp = mp;
    this.attack = attack;
    this.defense = defense;
    this.magic = magic;
    this.speed = speed;
  }
}

export default User;
