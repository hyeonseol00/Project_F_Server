class Monster {
  constructor(idx, id, hp, power, name, effectCode) {
    this.idx = idx;
    this.id = id;
    this.hp = hp;
    this.power = power;
    this.name = name;
    this.isDead = false;
    this.effectCode = effectCode;
  }
}

export default Monster;
