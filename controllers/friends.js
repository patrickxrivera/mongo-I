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
      next(err);
      return;
    }

    res.status(code.STATUS_CREATED).send(friendProps);
  },

  async read(req, res, next) {
    const [err, friends] = await to(Friend.find({}));
    res.send(friends);
  }
};
