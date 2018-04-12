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

    return err
      ? sendErrorProps(next, err, code.STATUS_USER_ERROR)
      : res.status(code.STATUS_CREATED).send(friendProps);
  },

  async find(req, res, next) {
    const [err, friends] = await to(Friend.find({}));

    return err
      ? sendErrorProps(next, err, code.STATUS_SERVER_ERROR)
      : res.send(friends);
  },

  async findById(req, res, next) {
    const friendId = req.params.id;

    const [err, friend] = await to(Friend.findById(friendId));

    return R.isNil(friend)
      ? sendErrorProps(next, err, code.STATUS_NOT_FOUND)
      : res.send(friend);
  },

  async remove(req, res, next) {
    const friendId = req.params.id;

    const [err, deletedFriend] = await to(Friend.remove({ _id: friendId }));

    return R.isNil(deletedFriend)
      ? sendErrorProps(next, err, code.STATUS_NOT_FOUND)
      : res.send(deletedFriend);
  },

  async update(req, res, next) {
    const friendId = req.params.id;
    const friendProps = req.body;

    // mongoose doesn't run validators on update by default
    // so we must manually configure this option
    // source: http://mongoosejs.com/docs/validation.html
    const optns = { runValidators: true };

    Friend.update({ _id: friendId }, friendProps, optns)
      .then(() => Friend.findById(friendId))
      .then((friend) => res.send(friend))
      .catch((err) => {
        return sendErrorProps(next, err, code.STATUS_NOT_FOUND);
      });
  }
};
