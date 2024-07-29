class level {
    constructor (levelId, requiredExp, hp, mp, attack, defense, magic, speed, skillPoint) {
        this.levelId = levelId;
        this.requiredExp = requiredExp;
        this.hp = hp;
        this.mp = mp;
        this.attack = attack;
        this.defense = defense;
        this.magic = magic;
        this.speed = speed;
        this.skillPoint = skillPoint;
    }
}

export default level;