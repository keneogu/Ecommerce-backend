const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
			return next(new Error(`${req.user.role} is not allowed to access this page`, 403))};
    next();
  };
};

module.exports = {authorize};
