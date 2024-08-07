class Item {
  constructor(quantity, itemInfo) {
    this.itemId = itemInfo.itemId;
    this.itemType = itemInfo.itemType;
    this.name = itemInfo.itemName;
    this.quantity = quantity;
    this.requireLevel = itemInfo.requireLevel;
    if (this.itemType === 'potion') {
      // potions
      this.hp = itemInfo.itemHp;
      this.mp = itemInfo.itemMp;
    } else {
      // mounting items
      this.addHp = itemInfo.itemHp;
      this.addMp = itemInfo.itemMp;
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
