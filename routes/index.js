const express = require('express');
const FriendsController = require('../controllers/friends');

const router = express.Router();

module.exports = (app) => {
  app.get('/api', FriendsController.root);
  app.post('/api/friend/new', FriendsController.create);
};
