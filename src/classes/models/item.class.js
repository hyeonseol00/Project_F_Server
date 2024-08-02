class Item {
  constructor(itemId, itemType, isPotion, name, hp, mp, exp, quantity, itemInfo = null) {
    this.itemId = itemId;
    this.itemType = itemType;
    this.isPotion = isPotion;
    this.name = name;
    this.quantity = quantity;
    if (isPotion) {
      // potions
      this.hp = hp;
      this.mp = mp;
      this.exp = exp;
    } else {
      // mounting items
      this.addHp = hp;
      this.addMp = mp;
      this.requireLevel = exp;
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
