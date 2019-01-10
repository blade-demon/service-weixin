var express = require('express');
const axios = require('axios');
var router = express.Router();
var jsSHA = require('jssha');
const appId = 'wx6fe393e6fff92bbb';
const appSecret = "15ac0d2469b0b6d4155cd9412f0b08c8";

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

router.get('/api/wechat/jscode2session', async(req, res) => {
  try {
    const code = req.query.jsCode;
    const response = await code2session(appId, appSecret, code);
    res.send({ result: response.data });
  }
  catch (e) {
    res.send(e);
  }
});

router.post('/api/verifyPsOnlineId', async(req, res) => {
  var body = req.body;
  let response = "";
  console.log(req.body);
  try {
    response = await axios.post('https://accounts.api.playstation.com/api/v1/accounts/onlineIds', body);
    res.status(201).send("-1");
  }
  catch (e) {
    console.log(e.response.data[0]);
    const resCode = e.response.data[0].code;
    console.log(resCode);
    if (resCode === "3101") {
      return res.status(200).send("1");
    }
    else {
      return res.status(200).send("-1");
    }
  }
});

// for test
router.post('/api/verifyPsOnlineId_2K', async(req, res) => {
  try {
    const response = await axios.post('http://27.115.86.98:2000/api/verifyPsOnlineId', req.body);
    console.log("返回的数据是：", response.data);
    res.status(200).json(response.data);
  } catch(e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.get('/api/issues', async(req, res) => {
  res.send({
    issues: [{
      title: '错误代码：xxxxx-XXXX-XXXXX',
      type: 'unsolved',
      date: '2018年6月6日',
      status: '已提交，审核中',
      unionId: '1'
    }, {
      title: '服务器连接失败，游戏不能打开！',
      date: '2018年6月12日',
      type: 'unsolved',
      status: '已审核，等待回复',
      unionId: '1'
    }, {
      title: '游戏中MC金币没有到账',
      date: '2018年6月16日',
      type: 'unsolved',
      status: '已审核，等待回复',
      unionId: '1'
    }, {
      title: '错误代码：xxxxx-XXXX-XXXXX',
      date: '2018年6月16日',
      type: 'solved',
      status: '已解决',
      unionId: '1'
    }, {
      title: '服务器连接失败，游戏不能打开！',
      date: '2018年6月22日',
      type: 'solved',
      status: '已解决',
      unionId: '1'
    }, {
      title: '错误代码：xxxxx-XXXX-XXXXX',
      date: '2018年6月6日',
      type: 'solved',
      status: '已解决',
      unionId: '2'
    }, {
      title: '服务器连接失败，游戏不能打开！',
      date: '2018年6月12日',
      type: 'solved',
      status: '已解决',
      unionId: '2'
    }]
  });
});

router.get('/api/faq', async(req, res) => {
  res.send([{
      id: 1,
      title: '《NBA 2K18》联机出现问题该如何解决？',
      desc: `亲爱的玩家
如果您在玩《NBA 2K18》的时候看到了显示错误代码「EFEAB30C」或「4B538E50」的讯息，通常表示您尚未下载最新的资料。若遇上这种情况，您必须先下载最近的更新数据才能继续玩游戏。
在这种情况下，您得耐着性子等候主机将资料下载完毕。至于实际要花多久时间则不一定，得视下载文件大小和您的网络连接速度而定。
话说回来：等资料下载完毕后，会弹出一则讯息要求您返回游戏主选单，好让更新数据生效。在此之后，您应可毫无困难地玩到游戏。
一般来讲，在「快速比赛」模式下打几场比赛便会触发更新数据的下载。当比赛结束时，《NBA 2K18》应会在画面角落显示更新讯息并要求您返回游戏主选单。
以上信息说明了此错误讯息常见的发生原因，不过，我们还发现了一些其他原因。我们将这些其他原因以及排除错误的方式归纳于下。
需重新发送账号电邮认证。
若要重新发送账号电邮认证，请执行以下步骤：
前往：https://www.nba2k.com
点击画面右上方的「登入」（Sign In）
输入您的MyPLAYER账号名称及密码
成功登入后，即会自动验证您的账号
若您游戏主机上创建的《NBA 2K》账号数量超过上限，您可能会遇到此错误讯息。
每部游戏主机上能够创建的《NBA 2K》账号数量上限是5个。如果您创建了超过5个账号，那么，除了该部主机上第一个创建的账号外，安全协议会阻挡所有其他《NBA 2K》账号与服务器联机。目前我们没有其他能排除此错误的方式，您得使用该部主机上第一个创建的账号进行联机游戏。
移除了您硬盘上的游戏预备空间。
预备空间指的是用来存放更新档和修正档的硬盘空间。像《NBA 2K》和《WWE 2K》这类游戏会定期使用这个空间。如果您移除了某个游戏的预备空间，下次启动该游戏时将会重建预备空间。若重建预备空间的程序被取消，您很有可能会遇到问题（包括《NBA 2K18》的错误讯息：EFEAB30C）。
我们在此疾呼：千万不要移除您硬盘上的游戏预备空间。
感谢您对《NBA 2K18》国行版的支持！
`
    },
    {
      id: 2,
      title: '出现错误代码：EFEAB30C/4B538E50该如何解决？',
      desc: `亲爱的玩家：
如果您玩《NBA 2K18》的在线模式时遇到了联机问题，请参考底下提供的联机问题问题解决指南：
查看我们的服务器状态网页来确认《NBA 2K18》服务器正常运作。
查看PlayStation Network的在线服务是否有任何已知问题。
检查您所有的网络实体装置确认这些装置都妥善连接且开启电源。
对每部连接网络的装置进行联机测试。
PlayStation 4的使用者请参考本网页提供的说明：
http://manuals.playstation.net/document/en/ps4/settings/nw_settings.html
认识NAT类型：
NAT是网络位置转换（Network Address Translation）的英文缩写。看起来虽然很复杂，但简单来说，您的NAT类型将决定您的游戏机透过网络与其他装置通讯的难易度。
NAT类型：
开放
开放NAT可以连接任意三种NAT类型。这大概是最少见的类型。
中等
中等NAT只能连接开放与中等NAT。这大概是最常见的类型。
严格
严格NAT只能联机开放NAT。
玩点对点游戏时，严格NAT会造成问题。因为大部分玩家不会采用开放NAT，所以采用严格NAT的玩家将无法找到任何可以加入的游戏。
另外，如果采用严格NAT的玩家顺利地加入了游戏，之后若有另一位采用中等NAT的玩家加入，将会导致采用严格NAT的玩家被踢出游戏。
更严重的是，有时候软件无法正确侦测玩家采用的NAT类型。这种情况往往会造成采用严格NAT的玩家被回报为采用中等NAT。
另一个问题是，有时候因特网服务供货商（Internet Service Provider，ISP）也会采用某种NAT类型，这通常表示如果您直接联机到因特网（中间没有隔着路由器或防火墙），ISP会让您依旧形同采用严格NAT。
若要联机至《NBA 2K》在线服务器，必须替您的路由器开启下列通讯端口：
TCP 80、UDP 88、UDP 3074、TCP 3074、UDP 53、TCP 53、UDP 3064、TCP 1795、TCP 1745、UDP 1795、UDP 1745
如果您需要开启这些通讯端口的指南，请参考以下网页（您需要知道您的路由器的品牌与型号，因为您得根据自己使用的路由器品牌与型号在网页上找到专属的指南）。
感谢您对《NBA 2K18》国行版的支持！
`
    },
    {
      id: 3,
      title: '服务器无法连接/出现其他错误代码/游戏掉线怎么办？',
      desc: `亲爱的玩家
如果您看到这则错误讯息，并且徒劳无功地重复被要求输入您用来注册2K账号的电子邮件地址，请看底下能帮助您重返球场的简单说明！
如果您启动《NBA 2K18》时发现您的账号失效了，不要慌张。首先，请验证您的账号。
如果您不确定自己用哪个电子邮件地址注册2K账号，请到游戏中查看：主选单 > 选项/功能 > 选项 > 设定 > 向下卷动至2K账号 - 电子邮件地址。
验证您的账号可以简单地解决很多游戏方面和联机方面的问题。如果您在信箱中没有看到验证电子邮件，请查看一下垃圾信箱，您可能会在那里发现应证电子邮件。
如果以上的方式都无法奏效，请尝试手动变更注册您账号的电子邮件地址。这样做会寄发一封新的确认电子邮件给您，并让您验证您的账号。
若要这样做，您可以前往：主选单 > 选项/功能 > 设定 > 2K账号 - 电子邮件地址，接着变更用来注册您账号的电子邮件地址。
之后，点击您收到的电子邮件中的验证链接，您就可以重新上线了！
请注意：填写注册2K账号的电子邮件地址时，输入有效的电子邮件格式（例如email@email.com）。这点很重要：如果您没有输入正确的电子邮件地址，验证电子邮件将无法寄达给您，而这会导致账号失效。
感谢您对《NBA 2K18》国行版的支持！
`
    },
    {
      id: 4,
      title: '国内服务器都在哪个城市架设的呢？一般延迟会在多少？',
      desc: `亲爱的玩家：
如果您没有收到每周配送梦幻球队卡牌包的话。
您必须进入梦幻球队模式才能领到卡牌包，然而，您还得在此模式里做点别的事情让我们知道您已进入此模式。光是进入选单，然后关闭或退出选单是不够的。开始一场比赛是让我们知道您已进入此模式的最直接方式。
一旦我们得知您进入过梦幻球队模式，您将会在下个周日领到一套卡牌包。
如果您之后开始每周进入梦幻球队模式（或是持续玩此模式），您将会领到预购时承诺给您的所有卡牌包。
`
    },
    {
      id: 5,
      title: '国服的数据能否在港服同步？',
      desc: `亲爱的玩家：
倘若您移除了硬盘上的预备空间，就会看到「『用户数据』档案损毁且无法加载」的错误讯息。
如果您对「预备空间」毫无概念，请阅读这篇文章。
游戏会重新下载预备空间数据，但如果这个程序被取消（在游戏重新启动后），您将无法进行任何在线游戏模式或使用任何相关在线档案。
为了确保数据正确下载，请尝试以下步骤：
加载游戏
选择「快速比赛」选项。不要进行比赛。
请停留在选单上。
如果您在PlayStation 4上玩游戏，于数据下载时，您可以让主机进入休眠模式。
几个小时后（或是更久，依据您的网速而定），您会在画面左下方看到黄色字体的通知讯息，提醒您返回主选单。在您返回主选单后，您的游戏已彻底更新完毕，并且重新安装了预备空间数据。
我们在此疾呼：千万不要移除您硬盘上的游戏预备空间。
感谢您对《NBA 2K18》国行版的支持！`
    },
    {
      id: 6,
      title: '球员名单是否可以更新？',
      desc: `亲爱的玩家
如果你在《NBA 2K18》里购买的虚拟货币（VC）没有汇入你的账号，你可找对地方了。
在你提出支持请求前，请特别注意：你购买的虚拟货币可能要过几个小时才会汇入你的账号（尤其是在网络壅塞的时候）。
如果你等了几个小时，你购买的虚拟货币依然没有汇入账号，我们很乐意协助你解决问题。
请注意：我们可能会把你提出的支持请求转交给Sony，以利查询遗失的虚拟货币去向。
请完整填写以下信息以供我们进行查询
PlayStation™Network ID
地区：
电子邮件地址：
遗失多少虚拟货币：
收据以及事务历史记录的副本（必须以相片或动图方式提供）：
收据会在确认购买后以电子邮件寄送给你。
有关事务历史记录部份，请确认其中包含你的用户名称、电子邮件地址或单号方便我们查阅。
请一并提供收据和你账号的事务历史记录副本。
如果你不晓得该怎么取得购买虚拟货币的记录，请参考以下指南；我们依照不同平台提供了详细的说明：
「账户管理」网站查看PlayStation®4上的事务历史记录：
（https://account.sonyentertainmentnetwork.com/pc/login.action?request）。
在主页面选择「事务历史记录」。
从「账户」下拉选单中选择您想要查看的账户（你也可以透过此页面查询相关附属账号）并选择日期范围。
选择一项事务历史记录查看细节。
感谢您对《NBA2K18》国行版的支持！`
    },
    {
      id: 7,
      title: '港服PSN帐号和会员，国行光盘能否进入国服？',
      desc: `亲爱的玩家，
只有《NBA 2K18》国行版本可以进入国服，我们无法保证后续的版本更新是否会对游戏数据的管理机制做出修改，建议使用PSN国服账号进行《NBA 2K18》国行版本的游戏体验，感谢您对《NBA 2K18》国行版的支持。`
    },
    {
      id: 8,
      title: '《NBA 2K18》国服拍卖行是否与港服连通？',
      desc: `亲爱的玩家，
国服拍卖行仅有《NBA 2K18》国行版的玩家可以进入，不与其他服务器联通，敬请谅解。`
    },
    {
      id: 9,
      title: '服务器无法连接/出现其他错误代码/游戏掉线怎么办？',
      desc: `亲爱的玩家：，
感谢您的反馈
如您方便，是否可以提供以下信息，以便我们更好的为您服务？
PSN ID
所在省份
所在城市
网络供应商
带宽
游戏版本
发生问题的日期及时间
提示的错误代码
NAT类型
给您在游戏过程中的体验造成了不便，我们由衷的向您表示歉意！一旦有任何进展，我们会第一时间与您联系，感谢您的理解！
`
    },
    {
      id: 10,
      title: '我购买的虚拟货币（VC）没有汇入我的账号怎么办？',
      desc: `亲爱的玩家
如果你在《NBA 2K18》里购买的虚拟货币（VC）没有汇入你的账号，你可找对地方了。
在你提出支持请求前，请特别注意：你购买的虚拟货币可能要过几个小时才会汇入你的账号（尤其是在网络壅塞的时候）。
如果你等了几个小时，你购买的虚拟货币依然没有汇入账号，我们很乐意协助你解决问题。
请注意：我们可能会把你提出的支持请求转交给Sony，以利查询遗失的虚拟货币去向。
请完整填写以下信息以供我们进行查询
PlayStation™Network ID
地区：
电子邮件地址：
遗失多少虚拟货币：
收据以及事务历史记录的副本（必须以相片或动图方式提供）：
收据会在确认购买后以电子邮件寄送给你。
有关事务历史记录部份，请确认其中包含你的用户名称、电子邮件地址或单号方便我们查阅。
请一并提供收据和你账号的事务历史记录副本。
如果你不晓得该怎么取得购买虚拟货币的记录，请参考以下指南；我们依照不同平台提供了详细的说明：
「账户管理」网站查看PlayStation®4上的事务历史记录：
（https://account.sonyentertainmentnetwork.com/pc/login.action?request）。
在主页面选择「事务历史记录」。
从「账户」下拉选单中选择您想要查看的账户（你也可以透过此页面查询相关附属账号）并选择日期范围。
选择一项事务历史记录查看细节。
感谢您对《NBA2K18》国行版的支持！`
    },
    {
      id: 11,
      title: '国行版本附赠国服PSN会员特典兑换出错',
      desc: `亲爱的玩家，
该特典仅供PSN非会员用户使用，请您在确认您的账号是否非PSN会员，倘若是的话，请告知我们并提供您的会员特典兑换码。我们在核实后会帮您进行更换。`
    },
    {
      id: 12,
      title: '为何没领到每周配送的梦幻球队卡牌包？',
      desc: `亲爱的玩家：
如果您没有收到每周配送梦幻球队卡牌包的话。
您必须进入梦幻球队模式才能领到卡牌包，然而，您还得在此模式里做点别的事情让我们知道您已进入此模式。光是进入选单，然后关闭或退出选单是不够的。开始一场比赛是让我们知道您已进入此模式的最直接方式。
一旦我们得知您进入过梦幻球队模式，您将会在下个周日领到一套卡牌包。
如果您之后开始每周进入梦幻球队模式（或是持续玩此模式），您将会领到预购时承诺给您的所有卡牌包。`
    },
    {
      id: 13,
      title: '辉煌生涯账号失效该怎么办？',
      desc: `亲爱的玩家
如果您看到这则错误讯息，并且徒劳无功地重复被要求输入您用来注册2K账号的电子邮件地址，请看底下能帮助您重返球场的简单说明！
如果您启动《NBA 2K18》时发现您的账号失效了，不要慌张。首先，请验证您的账号。
如果您不确定自己用哪个电子邮件地址注册2K账号，请到游戏中查看：主选单 > 选项/功能 > 选项 > 设定 > 向下卷动至2K账号 - 电子邮件地址。
验证您的账号可以简单地解决很多游戏方面和联机方面的问题。如果您在信箱中没有看到验证电子邮件，请查看一下垃圾信箱，您可能会在那里发现应证电子邮件。
如果以上的方式都无法奏效，请尝试手动变更注册您账号的电子邮件地址。这样做会寄发一封新的确认电子邮件给您，并让您验证您的账号。
若要这样做，您可以前往：主选单 > 选项/功能 > 设定 > 2K账号 - 电子邮件地址，接着变更用来注册您账号的电子邮件地址。
之后，点击您收到的电子邮件中的验证链接，您就可以重新上线了！
请注意：填写注册2K账号的电子邮件地址时，输入有效的电子邮件格式（例如email@email.com）。这点很重要：如果您没有输入正确的电子邮件地址，验证电子邮件将无法寄达给您，而这会导致账号失效。
感谢您对《NBA 2K18》国行版的支持！`
    },
    {
      id: 14,
      title: '出现错误讯息：「用户数据」损毁该怎么办？',
      desc: `亲爱的玩家：
倘若您移除了硬盘上的预备空间，就会看到「『用户数据』档案损毁且无法加载」的错误讯息。
如果您对「预备空间」毫无概念，请阅读这篇文章。
游戏会重新下载预备空间数据，但如果这个程序被取消（在游戏重新启动后），您将无法进行任何在线游戏模式或使用任何相关在线档案。
为了确保数据正确下载，请尝试以下步骤：
加载游戏
选择「快速比赛」选项。不要进行比赛。
请停留在选单上。
如果您在PlayStation 4上玩游戏，于数据下载时，您可以让主机进入休眠模式。
几个小时后（或是更久，依据您的网速而定），您会在画面左下方看到黄色字体的通知讯息，提醒您返回主选单。在您返回主选单后，您的游戏已彻底更新完毕，并且重新安装了预备空间数据。
我们在此疾呼：千万不要移除您硬盘上的游戏预备空间。
感谢您对《NBA 2K18》国行版的支持！
`
    },
    {
      id: 15,
      title: '游戏无法安装/光盘损坏/出现花屏/闪退怎么办？',
      desc: `亲爱的玩家，
麻烦提供一下您的联系方式以及您购买渠道的详细信息，我们会尽快与您取得联系，感谢您对《NBA 2K18》国行版的支持。`
    },
    {
      id: 16,
      title: '辉煌生涯模式加载过慢',
      desc: `亲爱的玩家，
请您先体验《NBA 2K18》的其他模式，在高峰时间段进行线上匹配的模式。感谢您对《NBA 2K18》国行版的支持！`
    },
    {
      id: 17,
      title: '辉煌生涯模式剧情无法跳过',
      desc: `亲爱的玩家，
目前的游戏版本暂不支持剧情跳过，感谢您对《NBA 2K18》国行版的支持。`
    }
  ]);
});


// 用户相关接口
router.post('/api/users/createUser', async(req, res) => {
  console.log(req.body);
  try {
    const response = await axios.post('https://portal.gamepoch.com/geadmin/api/geusers', req.body);
    console.log(response.data);
    res.status(200).send(response.data);
  }
  catch (e) {
    console.log(e.response.data);
    res.status(500).send(e.response.data);
  }
});

// 更新用户数据
router.post('/api/users/updateUser', async(req, res) => {
  try {
    const response = await axios.post('https://portal.gamepoch.com/geadmin/api/geusers', req.body);
    console.log(response.data);
    res.status(200).send(response.data);
  }
  catch (e) {
    console.log(e.response.data);
    res.status(500).send(e.response.data);
  }
});

// 获取所有的用户信息
router.get('/api/users', async(req, res) => {
  try {
    const response = await axios.get('https://portal.gamepoch.com/geadmin/api/geusers');
    res.status(200).send(response.data);
  }
  catch (e) {
    console.log(e.response.data);
    res.status(500).send(e.response.data);
  }
});

// 根据openId获取指定用户的信息的数据
router.get('/api/users/getUserByOpenId', async(req, res) => {
  try {
    const response = await axios.get('https://portal.gamepoch.com/geadmin/api/geusers?openid=' + req.query.openId);
    res.status(200).send(response.data);
  }
  catch (e) {
    console.log(e.response.data);
    res.status(500).send(e.response.data);
  }
});

// 根据geid获取指定用户的用户信息
router.get('/api/users/getUserByGEId', async(req, res) => {
  try {
    const response = await axios.get('https://portal.gamepoch.com/geadmin/api/geusers?geid=' + req.query.geid);
    res.status(200).send(response.data);
  }
  catch (e) {
    console.log(e.response.data);
    res.status(500).send(e.response.data);
  }
});

// 创建case
router.post('/api/cases/createCase', async(req, res) => {
  try {
    console.log(req.body);
    const response = await axios.post('https://portal.gamepoch.com/geadmin/api/gecases', req.body);
    res.status(200).send(response.data);
  }
  catch (e) {
    console.log(e.response.data);
    res.status(500).send(e.response.data);
  }
});

// 按照caseID进行查找
// Single Query by CaseID:
// GET:  http://portal.gamepoch.com/geadmin/api/gecases?caseid=GE20180729054230
router.get('/api/cases/getCaseByCaseId', async(req, res) => {
  try {
    const response = await axios.get('https://portal.gamepoch.com/geadmin/api/gecases?caseid=' + req.query.caseid);
    res.status(200).send(response.data);
  }
  catch (e) {
    console.log(e.response.data);
    res.status(500).send(e.response.data);
  }
});

// 按照GEID进行查找Case
// http://portal.gamepoch.com/geadmin/api/gecases?geid=123456
router.get('/api/cases/getCaseByGEId', async(req, res) => {
  try {
    const response = await axios.get('https://portal.gamepoch.com/geadmin/api/gecases?geid=' + req.query.geid);
    res.status(200).send(response.data);
  }
  catch (e) {
    res.status(500).send(e.response.data);
  }
});

// 按照GEID查找信息
// http://portal.gamepoch.com/geadmin/api/gecases?geid=123456
router.get('/api/cases/getCaseByGEId', async(req, res) => {
  try {
    const response = await axios.get('https://portal.gamepoch.com/geadmin/api/gecases?geid=' + req.query.geid);
    res.status(200).send(response.data);
  }
  catch (e) {
    console.log(e.response.data);
    res.status(500).send(e.response.data);
  }
});

// 修改case状态
// http://portal.gamepoch.com/geadmin/gepls/updatecase?caseid=GE20180729054230&newstatus=5
router.post('/api/cases/updatecase', async(req, res) => {
  try {
    console.log(req.body);
    const response = await axios.get('https://portal.gamepoch.com/geadmin/gepls/updatecase?caseid=' + req.body.caseid + '&newstatus=' + req.body.newstatus);
    res.status(200).send(response.data);
  }
  catch (e) {
    console.log(e.response);
    res.status(500).send(e.response.data);
  }
});

// 按照GEID来查找case的聊天信息
router.get('/api/casechats/getCaseChatByCaseId', async(req, res) => {
  try {
    const response = await axios.get('https://portal.gamepoch.com/geadmin/api/gecasechats?caseid=' + req.query.caseid);
    res.status(200).send(response.data);
  }
  catch (e) {
    if(e.response.status === 404) {
      return res.status(200).send([]);
    }
    res.status(500).send(e.response.data);
  }
});

// 创造聊天信息
router.post('/api/casechats', async(req, res) => {
  try {
    console.log(req.body);
    const response = await axios.post('https://portal.gamepoch.com/geadmin/api/gecasechats',req.body);
    res.status(200).send(response.data);
  }
  catch (e) {
    console.log(e.response);
    res.status(500).send(e.response.data);
  }
});

const code2session = (appId, appSecret, js_code) => axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${js_code}&grant_type=authorization_code`);

const code2accessToken = (appId, appSecret, js_code) => axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${js_code}&grant_type=authorization_code`);

module.exports = router;


/*

// For Development
let issues = [
  {
    title: '错误代码：xxxxx-XXXX-XXXXX',
    type: 'unsolved',
    date: '2018年6月6日',
    status: '已提交，审核中',
    unionId: '1'
  },
  {
    title: '服务器连接失败，游戏不能打开！',
    date: '2018年6月12日',
    type: 'unsolved',
    status: '已审核，等待回复',
    unionId: '1'
  },
  {
    title: '游戏中MC金币没有到账',
    date: '2018年6月16日',
    type: 'unsolved',
    status: '已审核，等待回复',
    unionId: '1'
  },
  {
    title: '错误代码：xxxxx-XXXX-XXXXX',
    date: '2018年6月16日',
    type: 'solved',
    status: '已解决',
    unionId: '1'
  },
  {
    title: '服务器连接失败，游戏不能打开！',
    date: '2018年6月22日',
    type: 'solved',
    status: '已解决',
    unionId: '1'
  },
  {
    title: '错误代码：xxxxx-XXXX-XXXXX',
    date: '2018年6月6日',
    type: 'solved',
    status: '已解决',
    unionId: '2'
  },
  {
    title: '服务器连接失败，游戏不能打开！',
    date: '2018年6月12日',
    type: 'solved',
    status: '已解决',
    unionId: '2'
  }
];
*/
