const MenuItem = require('../models/Menu.model');

// Get all menu items
exports.getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find({ available: true }).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching menu items' });
  }
};

// Get single menu item
exports.getMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching menu item' });
  }
};

// Create menu item (admin only)
exports.createMenuItem = async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: 'Error creating menu item' });
  }
};

// Update menu item (admin only)
exports.updateMenuItem = async (req, res) => {
  try {
      console.log('********************************')
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&7', item)
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: 'Error updating menu item' });
  }
};

// Delete menu item (admin only)
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting menu item' });
  }
};