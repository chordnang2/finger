var express = require("express");
var router = express.Router();

const fingerController = require("../controller/finger");

/* GET home page. */
router.get("/", fingerController.getAndAddFinger);

module.exports = router;

