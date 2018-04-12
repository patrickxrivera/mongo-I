module.exports = (next, err, code) => {
  const errProps = {
    message: err.message,
    code
  };
  return next(errProps);
};
