const FriendsController = require('../controllers/friends');

module.exports = (app) => {
  app.get('/api', FriendsController.root);
  app.post('/api/friend/new', FriendsController.create);
  app.get('/api/friends', FriendsController.find);
  app.get('/api/friends/:id', FriendsController.findById);
  app.delete('/api/friends/:id', FriendsController.remove);
  app.put('/api/friends/:id', FriendsController.update);
};
