const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Add this line
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const Dish = require('./models/Dish');

const server = http.createServer(app);
const io = new Server(server);

mongoose.connect('mongodb://localhost:27017/dish_management', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors()); // Add this line
app.use(express.json());

app.get('/api/dishes', async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/dishes/:id/togglePublish', async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    dish.isPublished = !dish.isPublished;
    await dish.save();
    io.emit('dishUpdated', dish);
    res.json(dish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
