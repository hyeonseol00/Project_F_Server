class Item {
  constructor(itemId, itemType, name, hp, mp, requireLevel, quantity, itemInfo = null) {
    this.itemId = itemId;
    this.itemType = itemType;
    this.name = name;
    this.quantity = quantity;
    this.requireLevel = requireLevel;
    if (itemType === 'potion') {
      // potions
      this.hp = hp;
      this.mp = mp;
    } else {
      // mounting items
      this.addHp = hp;
      this.addMp = mp;
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
