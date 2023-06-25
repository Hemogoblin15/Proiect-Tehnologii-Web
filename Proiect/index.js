const http = require("http");
const path = require("path");
const mime = require("mime");
const clientSessions = require("client-sessions");
const fs = require("fs");
const mongodbConnect = require("./database").mongodbConnect;
require("dotenv").config();
const PORT = process.env.PORT;

const { requireAuthentication } = require("./middleware");
const loginController = require("./controllers/loginController");
const homeController = require("./controllers/homeController");
const helpController = require("./controllers/helpController");
const learnController = require("./controllers/learnController");
const profileController = require("./controllers/profileController");
const Utils = require("./utils");

const sessionMiddleware = clientSessions({
  cookieName: "session",
  secret: "secret",
  duration: 24 * 60 * 60 * 1000, //
  activeDuration: 30 * 60 * 1000,
});

const server = http.createServer((req, res) => {
  let { method, url } = req;
  res.setHeader("Access-Control-Allow-Origin", `http://localhost:${PORT}`);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  sessionMiddleware(req, res, () => {
    switch (true) {
      case method === "POST" && url === "/login":
        console.log("loginpost");
        loginController.loginPost(req, res);
        break;
      case method === "GET" && url === "/login":
        console.log("login");
        loginController.loginGet(req, res);
        break;
      case method === "POST" && url === "/register":
        loginController.registerPost(req, res);
        break;
      case method === "GET" && url === "/register":
        loginController.registerGet(req, res);
        break;
      case method === "GET" && url === "/logout":
        loginController.logout(req, res);
        break;
      case method === "GET" && url === "/":
        Utils.redirectTo("/login", res);
        break;
      case method === "GET" && url === "/home":
        requireAuthentication(req, res, () => {
          homeController.homeGet(req, res);
        });
        break;
      case method === "GET" && url === "/learn":
        requireAuthentication(req, res, () => {
          learnController.learnGet(req, res);
        });
        break;
      case method === "POST" && url === "/help":
        console.log("helpPost");
        requireAuthentication(req, res, () => {
          helpController.helpPost(req, res);
        });
        break;
      case method === "GET" && url === "/help":
        console.log("helpGet");
        requireAuthentication(req, res, () => {
          helpController.helpGet(req, res);
        });
        break;
      case method === "POST" && url === "/learn/add":
        requireAuthentication(req, res, () => {
          learnController.lessonAddPost(req, res);
        });
        break;
      case method === "GET" && url === "/learn/add":
        requireAuthentication(req, res, () => {
          learnController.lessonAddGet(req, res);
        });
        break;
      case method === "POST" && url.endsWith("/edit") && url.startsWith("/learn/"):
        requireAuthentication(req, res, () => {
          learnController.lessonEditPost(req, res); 
        });
        break;
      case method === "GET" && url.endsWith("/edit") && url.startsWith("/learn/"):
        requireAuthentication(req, res, () => {
          learnController.lessonEditGet(req, res);
        });
        break;
      case method === "GET" && url.startsWith("/learn/"):
        requireAuthentication(req, res, () => {
          learnController.lessonGet(req, res);
        });
        break;
      case method === "GET" && url === "/about":
        requireAuthentication(req, res, async () => {
          homeController.aboutGet(req, res);
        });
        break;
      case method === "GET" && url === "/profile":
        requireAuthentication(req, res, async () => {
          profileController.profileGet(req, res);
        });
        break;
      case method === "GET" || method === "HEAD":
        Utils.sendResources(req, res, url);
        break;
      default:
        res.statusCode = 404;
        res.end("Not Found");
        break;
    }
  });
});

server.on("request", (req, res) => {
  sessionMiddleware(req, res, () => {
    server.emit("sessionParsed", req, res);
  });
});

mongodbConnect(async () => {
  server.listen(PORT, () =>
    console.log(`[server] Server running on port ${PORT}`)
  );
});
