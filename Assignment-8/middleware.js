const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You have to login to do this action');
    return res.redirect('/login');
  }
  next();
};

module.exports = { isLoggedIn };
