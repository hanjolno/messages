var express = require("express");
var session = require("express-session");
var router = require("./controller/router.js");
var app = express();

app.listen(4000);
app.set("view engine","ejs");
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(express.static("./public"));
app.use(express.static("./css"));
app.use(express.static("./script"));
app.use(express.static("./uploads"));

app.get("/",router.showIndex);       //显示首页
app.get("/login",router.showLogin);         //显示登录页
app.post("/login",router.login);            //提交登录信息
app.get("/regist",router.showRegist);       //显示注册页
app.post("/regist",router.regist);          //提交注册信息
app.get("/logout",router.logout);           //注销登录
app.get("/person",router.showPerson);       //显示个人页面
app.get("/change",router.showChange);       //显示修改头像页面
app.post("/upphoto",router.upphoto);        //提交修改头像(未裁剪)
app.post("/upimg",router.upimg);            //提交裁剪头像

app.get("/page",router.showPage);           //显示首页留言页码
app.get("/getUserPhotos",router.getUserPhotos);          //获取留言头像
app.post("/upNewMsg",router.upNewMsg);         //上传新留言
app.get("/allMember",router.allMember);         //显示所有成员
app.get("/myMsg",router.myMsg);             //显示个人留言