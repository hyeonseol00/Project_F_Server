class Item {
  constructor(itemId, isPotion, name, hp, mp, exp, quantity, itemInfo = null) {
    this.itemId = itemId;
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
      this.id = itemId;
      this.description = itemInfo.itemDescription;
      this.type = itemInfo.itemType;
      this.hp = hp;
      this.mp = mp;
      this.atk = itemInfo.itemAttack;
      this.def = itemInfo.itemDefense;
      this.magic = itemInfo.itemMagic;
      this.speed = itemInfo.itemSpeed;
      this.requireLevel = exp;
      this.avoidRate = itemInfo.itemAvoidance;
      this.critRate = itemInfo.itemCritical;
    }
  }
}

export default Item;
