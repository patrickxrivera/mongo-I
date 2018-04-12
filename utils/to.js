// ======= Helper for error handling with async/await ======= //

module.exports = (promise) =>
  promise
    .then((data) => {
      return [null, data];
    })
    .catch((err) => [err]);
