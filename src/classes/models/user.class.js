import { createPingPacket } from '../../utils/notification/game.notification.js';
import roundM5 from '../../utils/round.js';

class User {
  constructor(id, playerId, socket) {
    this.id = id;
    this.playerId = playerId;
    this.socket = socket;
    this.lastUpdateTime = Date.now();
    this.playerInfo = {};
  }

  setPlayerInfo(playerInfo){
    this.playerInfo = playerInfo;
  }

  updatePosition(x, y, z, rot) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.rot = rot
    this.lastUpdateTime = Date.now();
  }

  ping() {
    const now = Date.now();

    console.log(`${this.id}: ping`);
    this.socket.write(createPingPacket(now));
  }

  handlePong(data) {
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2;
    console.log(
      `${now}에 사용자 ${this.id}로부터 pong을 수신했습니다. 지연 시간: ${this.latency}ms`,
    );
  }

  calculatePosition(latency, newX = this.x, newY = this.y) {
    const elapsedTime = Date.now() - this.lastUpdateTime;
    const timeDiff = elapsedTime / 1000;
    const speed = 3;
    const distance = speed * timeDiff;

    const deltaPos = {
      x: roundM5(newX) - this.x,
      y: roundM5(newY) - this.y,
    };
    const deltaDistance = Math.sqrt(deltaPos.x * deltaPos.x + deltaPos.y * deltaPos.y);

    if (deltaDistance === 0 || (newX == 0 && newY == 0))
      return {
        x: this.x,
        y: this.y,
      };

    const unitVector = {
      x: deltaPos.x / deltaDistance,
      y: deltaPos.y / deltaDistance,
    };

    const vector = {
      x: unitVector.x * distance,
      y: unitVector.y * distance,
    };

    return {
      x: roundM5(this.x + vector.x),
      y: roundM5(this.y + vector.y),
    };
  }
}

export default User;
