var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/finger");
const port = process.env.PORT || 4100;

const cron = require("node-cron");
// const open = require("open");
const puppeteer = require("puppeteer");

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

cron.schedule("* * * * *", () => {
  console.log("Opening link...");
  (async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to the URL in the background
    await page.goto("http://localhost:4100/finger", {
      waitUntil: "networkidle0",
    });

    await browser.close();
  })();
  //   open("http://localhost:4000/finger");
});

module.exports = app;
