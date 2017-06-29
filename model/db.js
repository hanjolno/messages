//DAO层的封装，封装了跟数据库相关的常用操作
var MongoClient = require("mongodb").MongoClient;
//1.建立数据库连接
function _connectDB(callback){
    var url = "mongodb://localhost:27017/hanjolno";
    MongoClient.connect(url,function(err,db){
        if(err){
            callback(err,null);
        }
        callback(err,db);
    })
}
//2.定义插入函数
exports.insertOne=function(collectionName,json,callback){
    _connectDB(function(err,db){
        db.collection(collectionName).insertOne(json,function(err,result){
            callback(err,result);
        })
        db.close();
    })
};
//3.修改
exports.updateMany = function(collectionName,json1,json2,callback){
    _connectDB(function(err,db){
        db.collection(collectionName).updateMany(json1,json2,function(err,result){
            callback(err,result);
            db.close();
        })
    })
};
exports.deleteMany = function(collectionName,json,callback){
    _connectDB(function(err,db){
        db.collection(collectionName).deleteMany(json,function(err,result){
            callback(err,result);
            db.close();
        })
    })
};
/* 假设一共17条，没页显示pageSize条，现在只希望查询第page页内容的数据
    db.student.find({"age":30}).skip(pageSize*(page-1)).limit(pageSize).sort({"time":-1})
*/
exports.find = function(collectionName,json,C,D){
    //先判断用户调用时传入了几个参数
    //如果是3个参数分别是集合名，查询参数，回调函数
    if(arguments.length==3){
        var callback = C;
        var skipnum=0;
        var limitnum = 0;
        var sort = 0;
    }else if(arguments.length==4){
        //如果是4个参数分别是集合名，查询参数，分页配置(每页几条，当前第几页)，回调函数
        var callback = D;
        var args = C;//{"pageSize":3,"page":3}
        //计算出需要跳过多少条数据
        var skipnum = args.pageSize*(args.page-1)||0;
        //查询几条数据
        var limitnum = args.pageSize||0;
        //排序方式
        var sort = args.sort||{};
    }
    _connectDB(function(err,db){
        var all = db.collection(collectionName).find(json).skip(skipnum).limit(limitnum).sort(sort);
        var allResults=[];
        //将all对象转成数组
        all.toArray(function(err,docs){
            if(err){
                callback(err,null);
                db.close();
                return
            }
            allResults=docs;
            callback(null,allResults);
            db.close();
        })
    })
};
//定义查询总记录数
exports.getAll = function(collectionName,callback){
    _connectDB(function(err,db){
        db.collection(collectionName).count({}).then(function(count){
            callback(count);
            db.close();
        });
    })
};
exports.loginCheck = function(collectionName,json,callback){
    if(json.name==""){
        callback("请输入用户名");
        return
    }else if(json.pwd==""){
        callback("请输入密码");
        return
    }else{
        _connectDB(function(err,db){
            var a = db.collection(collectionName).find({"name":json.name});
            a.toArray(function(err,docs){
                if(docs.length==0){
                    callback("-2");
                }else if(docs[0].pwd!=json.pwd){
                    callback("-1")
                }else{
                    callback("1");
                }
            })
        })
    }

};
