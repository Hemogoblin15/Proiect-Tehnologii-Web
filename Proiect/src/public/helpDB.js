require("dotenv").config();
const SENDER = process.env.SENDER;
const PASSWORD = process.env.PASSWORD;
var nodemailer = require("nodemailer");
var querystring = require("querystring");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: SENDER,
    pass: PASSWORD,
  },
});

function sendEmail(req, res) {
  var body = "";

  req.on("data", function (data) {
    body += data;
  });

  req.on("end", function () {
    var postData = querystring.parse(body);
    var email = postData.email;
    var subject = postData.subject;
    var message =
      "Email: " + email + "\n" + "Text: \n" + postData.message;

    var mailOptions = {
      from: SENDER,
      to: "mannersmatter.help@gmail.com",
      subject: subject,
      text: message,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.write(`
        <script>
          alert("Ai trimis email-ul cu succes");
          window.location.href = "/help";
        </script>
      `);
    res.end();
  });
}

module.exports = sendEmail;