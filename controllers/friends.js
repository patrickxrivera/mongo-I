const Friend = require('../models/Friend');
const code = require('../utils/statusCodes');
const to = require('../utils/to');
const R = require('ramda');
const sendErrorProps = require('../utils/sendErrorProps');

module.exports = {
  root(req, res) {
    res.send({ api: 'running' });
  },

  async create(req, res, next) {
    const friendProps = req.body;

    const [err, friend] = await to(Friend.create(friendProps));

    if (err) {
      return sendErrorProps(next, err, code.STATUS_USER_ERROR);
    }

    res.status(code.STATUS_CREATED).send(friendProps);
  },

  async find(req, res, next) {
    const [err, friends] = await to(Friend.find({}));

    if (err) {
      return sendErrorProps(next, err, code.STATUS_SERVER_ERROR);
    }

    res.send(friends);
  },

  async findById(req, res, next) {
    const friendId = req.params.id;

    const [err, friend] = await to(Friend.findById(friendId));

    if (R.isNil(friend)) {
      return sendErrorProps(next, err, code.STATUS_NOT_FOUND);
    }

    res.send(friend);
  }
};
