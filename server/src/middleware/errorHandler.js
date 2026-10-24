// One place that turns every error into the same JSON shape: { message }
module.exports = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message;

  if (err.code === 11000) {
    status = 409;
    message = 'A book with this ISBN already exists';
  } else if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid value supplied';
  }

  if (status >= 500) {
    console.error(err); // details stay in the server log only
    message = 'Something went wrong on the server';
  }

  res.status(status).json({ message });
};
