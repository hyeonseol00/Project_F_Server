class Monster {
  constructor(idx, id, hp, power, name) {
    this.idx = idx;
    this.id = id;
    this.hp = hp;
    this.power = power;
    this.name = name;
    this.isDead = false;
  }
}

export default Monster;
