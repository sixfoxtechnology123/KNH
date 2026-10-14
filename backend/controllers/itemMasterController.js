const ItemMaster = require('../models/ItemMaster');

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await ItemMaster.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Item with Auto-Generated ID
exports.createItem = async (req, res) => {
  try {
    const { itemName, rate, status } = req.body;

    // Generate unique auto-incrementing ID (e.g. ITEM-1, ITEM-2...)
    const lastItem = await ItemMaster.findOne().sort({ createdAt: -1 });
    let nextIdNumber = 1;
    if (lastItem && lastItem.itemId) {
      const parts = lastItem.itemId.split('-');
      const num = parseInt(parts[1], 10);
      if (!isNaN(num)) nextIdNumber = num + 1;
    }
    const itemId = `ITEM-${nextIdNumber}`;

    const newItem = new ItemMaster({
      itemId,
      itemName,
      rate,
      status: status || 'Active',
    });

    const savedItem = await newItem.save();
    res.status(201).json({ success: true, data: savedItem, message: "Item created successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Item
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemName, rate, status } = req.body;

    const updatedItem = await ItemMaster.findByIdAndUpdate(
      id,
      { itemName, rate, status },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.status(200).json({ success: true, data: updatedItem, message: "Item updated successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Item
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await ItemMaster.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.status(200).json({ success: true, message: "Item deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};