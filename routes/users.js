var express = require("express");
var router = express.Router();
var multer = require("multer");
var path = require("path");
var fs = require("fs");
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/images/uploads");
  },
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

var upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).array("images", 4);

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}


router.get("/", (req, res) => {
  res.send("user");
});

router.post("/upload", function(req, res) {
    console.log(req.files);
  upload(req, res, err => {
    if (err) {
      res.send({ msg: err});
    } else {
        console.log(req.files);
      if (req.files.length === 0) {
        res.send({
          filesPath: []
        });
      } else {
        const path = req.files.map(file => file.path.substr(7));
        console.log(path);
        res.send({
          filesPath: path
        });
      }
    }
  });
});

router.post("/uploadImageBase64", (req, res)=>{
	var imgData = req.body.data;
	//过滤data:URL
	var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
	var dataBuffer = new Buffer(base64Data, 'base64');
	const fileName =  "images-" + new Date().getTime() + ".jpg";
	fs.writeFile("./public/images/uploads/" + fileName, dataBuffer, function(err) {
		if(err){
		  res.send(err);
		}else{
		  res.send({
		    filesPath: "https://servicewechat.gamepoch.com/images/uploads/" + fileName 
		  });
		}
	});

});

module.exports = router;
