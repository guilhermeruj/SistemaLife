const User = require("../models/Users");
module.exports.checkAuth = async function (req, res, next) {
  const userId = req.session.userid;
  if (!userId) {
    res.redirect("/login");
  } else {
    const user = await User.findOne({ where: { id: userId } });
    req.session.username = user.name;
    req.session.usernivel = user.nivel;
    req.session.userid = user.id;
    next();
  }
};

module.exports.eqHelper = function (a, b, options) {
  if (a === b) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};

