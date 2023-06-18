var url = require("url");
var fs = require("fs");
var appRootPath = require("app-root-path");
var path = require("path");
var RegisterRoute = require("./registerDB.js");
var LoginRoute = require("./loginDB.js");
var LogoutRoute = require("./logoutDB.js");
var cookie = require("cookie");

function handleRequest(req, res) {
  var requestUrl = url.parse(req.url).pathname;
  var fsPath;

  if (
    (requestUrl === "/home" ||
      requestUrl === "/about" ||
      requestUrl === "/learn" ||
      requestUrl === "/profile") &&
    !isLoggedIn(req)
  ) {
    res.statusCode = 302;
    res.setHeader("Location", "/");
    res.end();
    return;
  }

  if ((requestUrl === "/" || requestUrl === "/register") && isLoggedIn(req)) {
    res.statusCode = 302;
    res.setHeader("Location", "/home");
    res.end();
    return;
  }

  if (requestUrl === "/") {
    fsPath = path.resolve(appRootPath + "/src/html/login.html");
  } else if (requestUrl === "/home") {
    fsPath = path.resolve(appRootPath + "/src/html/home.html");
  } else if (requestUrl === "/register") {
    fsPath = path.resolve(appRootPath + "/src/html/register.html");
  } else if (requestUrl === "/about") {
    fsPath = path.resolve(appRootPath + "/src/html/about.html");
  } else if (requestUrl === "/learn") {
    fsPath = path.resolve(appRootPath + "/src/html/learn.html");
  } else if (requestUrl === "/profile") {
    fsPath = path.resolve(appRootPath + "/src/html/profile.html");
  } else if (path.extname(requestUrl) === ".css") {
    fsPath = path.resolve(appRootPath + "/src" + requestUrl);
    res.setHeader("Content-Type", "text/css");
  } else if (path.extname(requestUrl) === ".png") {
    fsPath = path.resolve(appRootPath + "/src" + requestUrl);
    res.setHeader("Content-Type", "image/png");
  } else if (path.extname(requestUrl) === ".jpg") {
    fsPath = path.resolve(appRootPath + "/src" + requestUrl);
    res.setHeader("Content-Type", "image/jpeg");
  } else {
    fsPath = path.resolve(appRootPath + "/src/html/404.html");
  }

  if (requestUrl === "/" && req.method === "POST") {
    LoginRoute(req, res);
    return;
  } else if (requestUrl === "/register" && req.method === "POST") {
    RegisterRoute(req, res);
    return;
  } else if (requestUrl === "/logout") {
    LogoutRoute(req, res);
    return;
  }

  fs.stat(fsPath, function (err, stat) {
    if (err) {
      console.log("ERROR" + err);
      res.statusCode = 404;
      res.end();
    } else {
      res.statusCode = 200;
      fs.createReadStream(fsPath).pipe(res);
    }
  });
}

function isLoggedIn(req) {
  var cookies = cookie.parse(req.headers.cookie || "");

  if (cookies.token) {
    return true;
  } else {
    return false;
  }
}

module.exports = handleRequest;
