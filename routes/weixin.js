const express = require("express");
const router = express.Router();

router.get('/', function(req, res) {
   res.send("get weixin api from these apis"); 
});

module.exports = router;