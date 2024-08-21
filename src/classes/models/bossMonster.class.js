import Monster from './monster.class.js';

class BossMonster extends Monster {
  constructor(
    idx,
    id,
    hp,
    power,
    name,
    effectCode,
    exp,
    gold,
    critical,
    criticalAttack,
    maxHp,
    transform,
    speed,
  ) {
    super(idx, id, hp, power, name, effectCode, exp, gold, critical, criticalAttack, maxHp);
    this.transform = transform;
    this.speed = speed;
  }

  getDistanceFromPlayer(userTransform) {
    const { posX, posZ } = this.transform;
    const deltaX = userTransform.posX - posX;
    const deltaZ = userTransform.posZ - posZ;
    return Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);
  }

  getUnitVectorFromPlayer(userTransform) {
    const { posX: playerX, posZ: playerZ } = userTransform;
    const { posX, posZ } = this.transform;
    const directX = playerX - posX;
    const directZ = playerZ - posZ;
    const magnitude = Math.sqrt(directX * directX + directZ * directZ);

    if (magnitude === 0) {
      return { x: 0, z: 0 }; // 두 점이 같을 때 방향 벡터는 (0, 0)
    }

    return { x: directX / magnitude, z: directZ / magnitude };
  }
}

export default BossMonster;
