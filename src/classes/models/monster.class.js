class Monster {
  constructor(idx, id, hp, power, name, effectCode, exp , gold) {
    this.idx = idx;
    this.id = id;
    this.hp = hp;
    this.power = power;
    this.name = name;
    this.isDead = false;
    this.effectCode = effectCode;
    this.exp = exp;
    this.gold = gold;
  }
}

export default Monster;
