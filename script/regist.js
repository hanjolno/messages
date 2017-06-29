$("#btn_reg").on("click",function(){
    //console.log($("#formReg").serialize())
    $.ajax({
        url:"/regist",
        type:"POST",
        async:false,
        data:$("#formReg").serialize(),
        success:function(results){
            if(results=="用户名已被注册"){
                $("#reg_msg").html(results).css("display","block");
            }else if(results=="注册失败，请重试"){
                $("#reg_msg").html(results).css("display","block");
            }else {
                window.location.href="/"
            }
        }
    })
});