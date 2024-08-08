class Item {
  constructor(itemId, quantity = 1) {
    try {
      if (!itemId) {
        return;
      }
      this.itemId = itemId;
      this.quantity = quantity;
      this.isPotion = this.potionCheck(itemId);
    } catch (err) {
      throw new Error(err);
    }
  }

  potionCheck(itemId) {
    if (46 <= itemId && itemId <= 50) return true;
    return false;
  }
}

export default Item;
