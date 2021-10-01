let data=document.getElementById("login-verify")
console.log(data)

const logout=document.getElementsByClassName("log-out")

var logout_para=document.getElementById("logout");
logout[0].addEventListener("mouseover",()=>{
    logout_para.innerHTML="logout";

    logout_para.style.paddingLeft="10px"
})
logout[0].addEventListener("mouseout",()=>{
    logout_para.innerHTML="";
})