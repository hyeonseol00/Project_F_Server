class Item {
  constructor(id, quantity = 1) {
    try {
      if (!id) {
        return;
      }
      this.id = id;
      this.quantity = quantity;
      this.isPotion = this.potionCheck(id);
    } catch (err) {
      throw new Error(err);
    }
  }

  potionCheck(id) {
    if (46 <= id && id <= 50) return true;
    return false;
  }
}

export default Item;
