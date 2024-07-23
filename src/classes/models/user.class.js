import roundM5 from '../../utils/round.js';

class User {
  constructor(id, playerId, socket) {
    this.id = id;
    this.playerId = playerId;
    this.socket = socket;
    this.lastUpdateTime = Date.now();
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
    this.lastUpdateTime = Date.now();
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
