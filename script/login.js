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
            if(results=="请输入用户名"){
                $("#p_log_name").html("请输入用户名")
            }else if(results=="请输入密码"){
                $("#p_log_pwd").html("请输入密码")
            }else if(results=="-2"){
                $("#p_log_name").html("用户名不正确")
            }else if(results=="-1"){
                $("#p_log_pwd").html("密码不正确")
            }else{
                window.location.href="/"
            }
        }
    })
    $("#exampleInputPassword1").val("");
});