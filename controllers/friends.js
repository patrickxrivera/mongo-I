const Friend = require('../models/Friend');
const code = require('../utils/statusCodes');

module.exports = {
  root(req, res) {
    res.send({ api: 'running' });
  },

  async create(req, res) {
    const friendProps = req.body;
    Friend.create(friendProps)
      .then(() => {
        res.status(code.STATUS_CREATED).send(friendProps);
      })
      .catch((err) => {
        res.status(code.STATUS_USER_ERROR).send({ error: err.message });
      });
  }
};
