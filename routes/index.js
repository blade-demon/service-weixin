var express = require('express');
const axios = require('axios');
var router = express.Router();
var jsSHA = require('jssha');
const appId = 'wx6fe393e6fff92bbb';
const appSecret = "";

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Gamepoch' });
});


/**
 *  校验GET请求来自微信服务器步骤：
 *  1、将token、timestamp、nonce三个参数进行字典序排序
 *  2、将三个参数字符串拼接成一个字符串进行sha1加密
 *  3、开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
 */
router.get('/auth', (req, res) => {
  var token = "gamepoch*2018";
  var signature = req.query.signature;
  var timestamp = req.query.timestamp;
  var echostr = req.query.echostr;
  console.log("echostr:", echostr);
  var nonce = req.query.nonce;
  var oriArray = new Array();
  oriArray[0] = nonce;
  oriArray[1] = timestamp;
  oriArray[2] = token;
  oriArray.sort();
  var original = oriArray.join('');
  var shaObj = new jsSHA("SHA-1", 'TEXT');
  shaObj.update(original);
  var hash = shaObj.getHash("HEX");
  console.log(hash);
  if (signature == hash) {
    //验证成功
    return res.send(echostr);
  }
  else {
    //验证失败
    return res.status(500).send('ok');
  }
});

router.post('/login', async (req, res) => {
  const code = req.body.code;
  const response = await code2session(appId, appSecret, code);
  console.log(response.data);
  res.send('ok');
});



const code2session = (appId, appSecret, js_code) => axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${js_code}&grant_type=authorization_code`);


module.exports = router;
