const jwt = require("jsonwebtoken");
const Utils = require("./utils");
require("dotenv").config();

function requireAuthentication(req, res, next) {

  const token = req.headers.cookie?.replace("token=", "") || "";
  console.log(token);

  if (!token) {
    console.log("NO TOKEN");
    Utils.redirectTo("/login", res);
    return;
  }

  try {
    let decodedToken;

    jwt.verify(token, process.env.JWT_KEY, (err, tokenUser) => {
      if (err) {
        res.setHeader("Set-Cookie", "token=; Max-Age=0");
        Utils.redirectTo("/login", res);

        return;
      }
      decodedToken = { id: tokenUser.id };
    });

    if (!decodedToken.id) {
      res.setHeader("Set-Cookie", "token=; Max-Age=0");
      Utils.redirectTo("/login", res);
      return;
    }

    req.locals = { userId: decodedToken.id };
  } catch (err) {
    console.log("CATCH");
    console.log(err);
    res.setHeader("Set-Cookie", "token=; Max-Age=0");
    Utils.redirectTo("/login", res);
  }
  next(req, res);
}

module.exports = { requireAuthentication };