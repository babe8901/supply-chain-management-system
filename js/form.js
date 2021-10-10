let data=document.getElementById("login-verify")
console.log(data)

const logout=document.getElementsByClassName("log-out")

var logout_para=document.getElementById("logout");


//Show Destination Address
var address=document.getElementsByClassName("address")
console.log(address)

var registered_address=document.getElementById("registered_address")
var new_address=document.getElementById("new_address")
console.log(registered_address)
console.log(new_address)

registered_address.addEventListener("click",function(){
    address[0].style.display="block";
    document.getElementById("address").value="<%=user['address']%>"
    

})
new_address.addEventListener("click",()=>{
    address[0].style.display="block";
    document.getElementById("address").value=""
})