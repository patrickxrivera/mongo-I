const Friend = require('../models/Friend');
const code = require('../utils/statusCodes');
const to = require('../utils/to');

module.exports = {
  root(req, res) {
    res.send({ api: 'running' });
  },

  async create(req, res, next) {
    const friendProps = req.body;

    const [err, friend] = await to(Friend.create(friendProps));

    if (err) {
      const errMsg =
        'Please provide firstName, lastName and age for the friend.';
      next(errMsg);
      return;
    }

    res.status(code.STATUS_CREATED).send(friendProps);
  }
};
