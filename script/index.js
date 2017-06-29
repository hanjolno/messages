//var str = "<div class='col-md-4'><p>【姓名】：{{= name }}</p><p>【留言】：{{= content }}</p><p>【时间】：{{= time }}</p><p><a class='btn btn-default' href='#' role='button'>查看详情 &raquo;</a></p>";
var content = "<div class='col-md-4 main_div'><div class='row'><div class='col-xs-4'><img src='/{{= photos }}' class='main_img'><p class='main_name'>{{= name}}</p></div><div class='col-xs-8 main_content'>{{= content}}<p class='main_time'>{{= time}}</p></div></div></div>";
var strPage = "<a class='btn btn-default' id='page{{= num }}'onclick='pageClick({{= num }})'>{{= num }}</a>";
$("#btn_log").on("click",function(){
    //console.log($("#formReg").serialize())
    $("#p_log_pwd").html("&nbsp;");
    $("#p_log_name").html("&nbsp;");
    $.ajax({
        url:"/login",
        type:"POST",
        async:false,
        data:$("#formLog").serialize(),
        success:function(results){
            if(results=="1"){
                window.location.href="/"
            }else {
                window.location.href="/login?key=1"
            }
        }
    })
    $("#exampleInputPassword1").val("");
});
function getPage(pageNum){
    $(".main").html("");
    $.ajax({
        url:"/page",
        data:{"page":pageNum},
        success:function(results){
            //console.log(data);
            //$.each(data,function(i,obji){
                //console.log(i,obji);
            //    var compiled = _.template(content);
            //    $(".main").append(compiled(obji));
            //})
            (function interator(i){
                if(i==results.length){
                    return
                }
                $.ajax({
                    url:"/getUserPhotos",
                    data:{"name":results[i].name},
                    success:function(results2){
                        results[i].photos=results2;
                        var compiled = _.template(content);
                        $(".main").append(compiled(results[i]));
                        interator(i+1)
                    }
                })
            })(0)
        }
    });
    //page颜色
    $("#page"+pageNum).addClass("btn btn-info pageNow").siblings("a").attr("class","btn btn-default")
}
function content(results){
    //$.each(results[1],function(i,obji){
    //    //console.log(i,obji);
    //    var compiled = _.template(content);
    //    $(".main").append(compiled(obji));
    //});
    (function interator(i){
        if(i==results[1].length){
            return
        }
        $.ajax({
            url:"/getUserPhotos",
            data:{"name":results[1][i].name},
            success:function(results2){
                results[1][i].photos=results2;
                var compiled = _.template(content);
                $(".main").append(compiled(results[1][i]));
                interator(i+1)
            }
        })
    })(0);
    //console.log(data[0]);
    $(".pageNum").html("");
    for(var i=1;i<=results[0];i++){
        var obji = {"num":i};
        var compiledPage = _.template(strPage);
        $(".pageNum").append(compiledPage(obji));
    }
    $("#page1").addClass("btn btn-info pageNow").siblings("a").attr("class","btn btn-default")
}
//打开页面
$(function(){
    getPage(1);
});
//提交新内容
$(".submit").on("click",function(){
    //var form = new FormData($("form"));
    //form.append("name",$(".name").attr("value"));
    //console.log(form)
    $(".main").html("");
    $.ajax({
        url:"/upNewMsg",
        type:"POST",
        data:{"content":$('#myMsg').val()},// 你的formid,
        success:function(results){
            (function interator(i){
                if(i==results[1].length){
                    return
                }
                $.ajax({
                    url:"/getUserPhotos",
                    data:{"name":results[1][i].name},
                    success:function(results2){
                        results[1][i].photos=results2;
                        var compiled = _.template(content);
                        $(".main").append(compiled(results[1][i]));
                        interator(i+1)
                    }
                })
            })(0);
            //console.log(data[0]);
            $(".pageNum").html("");
            for(var i=1;i<=results[0];i++){
                var obji = {"num":i};
                var compiledPage = _.template(strPage);
                $(".pageNum").append(compiledPage(obji));
            }
            $("#page1").addClass("btn btn-info pageNow").siblings("a").attr("class","btn btn-default")
        },
        complete:function(){
            if($(".main").html()==""){
                location.reload()
            }
        }
    })
    $("#myMsg").val("");
});

//跳转page
$(".pageNum a").on("click",function(){
    var num = $(this).html();
    getPage(num);
});
function pageClick(n){
    getPage(n);
}