var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/finger");
const port = process.env.PORT || 4100;

const cron = require("node-cron");
// const open = require("open");
// const puppeteer = require("puppeteer");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
app.use("/finger", indexRouter);
const { exec } = require('child_process');
const url = "http://localhost:4100/finger";

cron.schedule("* * * * *", () => {
  console.log("Opening link...");
  (async () => {
    // const browser = await puppeteer.launch({ headless: true });
    // const page = await browser.newPage();
    // await page.goto("http://localhost:4100/finger", {
    //   waitUntil: "networkidle0",
    // });

    // await browser.close();
    await exec(`curl ${url}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }

      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  })();
  //   open("http://localhost:4000/finger");
});

module.exports = app;

