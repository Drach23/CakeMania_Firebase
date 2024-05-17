function saveUserDataToRequest(req, res, next) {
    if (req.user) {
      const userData = {
        email: req.user.email,
        firstName: req.user.firstname,
        lastName: req.user.lastname,
        phone: req.user.phone,
        username: req.user.username
      };
      req.userData = userData;
    }
    next();
  }