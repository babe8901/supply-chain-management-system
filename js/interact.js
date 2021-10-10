var cancel=document.getElementById("cancel")
console.log(cancel)
var ul=document.getElementById("ul")
console.log(ul)
var bar=document.getElementById("bar")
var slider=document.getElementsByClassName("slider")
console.log(slider)
var content=document.getElementsByClassName("content")
//Apply onclick event on cancel button
cancel.addEventListener("click",()=>{
    slider[0].style.left="-350px"
    
    bar.style.display="inline-block"
    cancel.style.display="none";
    content[0].style.width="100%"
})

bar.addEventListener("click",()=>{
    slider[0].style.left="0px";
    cancel.style.display="inline-block";
    bar.style.display="none"
    content[0].style.width="77%"
})


