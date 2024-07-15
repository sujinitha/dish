const express = require('express');
const router = express.Router();
const Dish = require('../../models/Dish');

// GET all dishes
router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Toggle isPublished status
router.post('/:dishId/togglePublish', async (req, res) => {
  const { dishId } = req.params;
  try {
    const dish = await Dish.findOne({ dishId });
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    dish.isPublished = !dish.isPublished;
    await dish.save();
    res.json(dish);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
