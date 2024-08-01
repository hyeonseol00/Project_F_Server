class Item {
  constructor(isPotion, name, hp, mp, exp, quantity, itemInfo = null) {
    if (isPotion) {
      // potions
      this.isPotion = true;
      this.name = name;
      this.hp = hp;
      this.mp = mp;
      this.exp = exp;
      this.quantity = quantity;
    } else {
      // mounting items
      this.isPotion = false;
      this.name = name;
      this.addHp = hp;
      this.addMp = mp;
      this.requireLevel = exp;
      this.quantity = quantity;
      this.addAttack = itemInfo.itemAttack;
      this.addDefense = itemInfo.itemDefense;
      this.addMagic = itemInfo.itemMagic;
      this.addSpeed = itemInfo.itemSpeed;
      this.cost = itemInfo.itemCost;
      this.addAvoidance = itemInfo.itemAvoidance;
      this.addCritical = itemInfo.itemCritical;
    }
  }
}

export default Item;
