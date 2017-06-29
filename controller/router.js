var db = require("../model/db.js");
var md5 = require("../model/md5.js");
var formidable = require("formidable");
var sd = require("silly-datetime");
var fs = require("fs");
var gm = require("gm");
var path = require("path");
exports.showIndex=function(req,res){
    var allData="";
    if(req.session.login=="1"){
        db.find("Msg",{},function(err,results){
            allData=Math.ceil(results.length/6);
            db.find("Msg_user",{"name":req.session.name},function(err,results){
                //console.log(results)
                if(results.length==0){
                    req.session.photo="default.jpg"
                }else {
                    req.session.photo=results[0].photos;
                }
                res.render("index",{
                    "allData":allData,
                    "login":true,
                    "name":req.session.name,
                    "photo":req.session.photo,
                    "active":"index"
                });
            });
        });

    }else{
        db.find("Msg",{},function(err,results){
            allData=Math.ceil(results.length/6);
            //console.log(allData)
            res.render("index",{
                "allData":allData,
                "login":false,
                "name":"",
                "photo":"",
                "active":"index"
            });
        });
    }

};
exports.showLogin=function(req,res){
    res.render("login",{
        "login":req.session.login=="1"?true:false,
        "name":req.session.login=="1"?req.session.name:"",
        "active":"login"
    });
};
exports.logout=function(req,res){
    req.session.login="-1";
    req.session.username="";
    res.redirect("/");
};
exports.showRegist=function(req,res){
    res.render("regist",{
        "login":req.session.login=="1"?true:false,
        "name":req.session.login=="1"?req.session.name:"",
        "active":"regist"
    });
};
exports.regist=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        var pwd = md5(fields.pwd);
        db.find("Msg_user",{"name":fields.name},function(err,results){
            if(results.length==1){
                res.send("用户名已被注册");
                return
            }else{
                db.insertOne("Msg_user",{"name":fields.name,"pwd":pwd,"photos":"default.jpg"},function(err){
                    if(err){
                        res.send("注册失败，请重试");
                        return
                    }
                    req.session.login="1";
                    req.session.name=fields.name;
                    res.send("注册成功")
                })
            }
        })
    });
};
exports.login=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        //console.log(fields)
        var pwd = md5(fields.pwd);
        //console.log({"name":fields.name,"pwd":pwd});
        db.loginCheck("Msg_user",{"name":fields.name,"pwd":pwd},function(results){
            if(results=="1"){
                req.session.name=fields.name;
                req.session.login="1";
                res.send(results);
            }else{
                res.send(results);
            }
        });
    })
};
exports.showPerson=function(req,res){
    if(req.session.login!="1"){
        res.send("请重新登录")
    }
    res.render("person",{
        "login":req.session.login=="1"?true:false,
        "name":req.session.login=="1"?req.session.name:""
    })
};
exports.showChange=function(req,res){
    //console.log(req.session.name);
    if(req.session.login!="1"){
        res.send("请重新登录");
        return
    }
    res.render("change",{
        "login":true,
        "name":req.session.name,
        "active":""
    })
};
exports.upphoto=function(req,res){
    if(req.session.login!="1"){
        res.send("请重新登录");
        return
    }
    var form = new formidable.IncomingForm();
    form.uploadDir = "./uploads";
    form.parse(req,function(err,fields,files){
        var fname = files.photos.name;
        var extname = path.extname(fname);
        fname = req.session.name+extname;
        //改名
        //console.log(fname)
        fs.rename(files.photos.path,"./uploads/"+fname,function(err){

        });
        res.render("cut",{
            "login":true,
            "photos": fname,
            "name":fields.name,
            "active":""
        });
    })
};
exports.upimg=function(req,res){
    //console.log(req.query);
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        //console.log(fields)
        gm("./uploads/"+fields.photos).crop(fields.a,fields.b,fields.e,fields.d).resize("100","100").write("./uploads/"+fields.photos,function(err){
            if(err){
                console.log(err)
            }
            db.updateMany("Msg_user",{"name":fields.name},{$set:{"photos":fields.photos.slice(1)}},function(){
                res.send();
            })
        });
    })
};
//主页加载，显示页码
exports.showPage=function(req,res){
    db.find("Msg",{},function(err,results){
        allData=Math.ceil(results.length/4);
        //console.log(allData)
    });
    var config = {"pageSize":6,"page":req.query.page,sort:{"time":-1}};
    db.find("Msg",{},config,function(err,results){
        if(err){
            console.log(err);
            return
        }
        res.send(results);
    });
};
exports.getUserPhotos=function(req,res){
    db.find("Msg_user",{"name":req.query.name},function(err,results){
        if(err){
            console.log(err);
            return
        }
        res.send(results[0].photos);
    })
};
exports.upNewMsg=function(req,res){
    var arrData=[];
    var time = sd.format(new Date,"YYYY/MM/DD-HH:mm:ss");
    //req.body.date = date;
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        fields.time = time;
        fields.name = req.session.name;
        //console.log(fields);
        db.insertOne("Msg",fields,function(err,results){
            if(err){
                console.log("false");
                return
            }
            //console.log("上传新数据成功")
            db.find("Msg",{},function(err,results){
                allData=Math.ceil(results.length/4);
                arrData.push(allData)
            });
            db.find("Msg",{},{"pageSize":6,"sort":{"time":-1}},function(err,results){
                if(err){
                    console.log(err);
                    return
                }
                arrData.push(results);
                res.send(arrData);
            });
        });
    });
};
exports.allMember=function(req,res){
    db.find("Msg_user",{},function(err,results){
        if(err){
            console.log(err);
            return
        }
        if(req.session.login=="1"){
            res.render("allMember",{
                "login":true,
                "name":req.session.name,
                "active":"allMember",
                "results":results
            })
        }else{
            res.render("allMember",{
                "login":false,
                "name":"",
                "active":"allMember",
                "results":results
            })
        }
    })
};
exports.myMsg=function(req,res){
    if(req.session.login!="1"){
        res.send("请重新登录");
        return
    }
    //console.log(req.session.photo)
    db.find("Msg",{"name":req.session.name},function(err,results){
        res.render("myMsg",{
            "name":req.session.name,
            "active":"myMsg",
            "login":true,
            "photos":req.session.photo,
            "results":results
        })
    });

};