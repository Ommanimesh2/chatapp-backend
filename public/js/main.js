const chatBox=document.getElementById("msg")
const chatbtn=document.getElementById("tick")
const msgContainer=document.querySelector(".containers")
const userlist=document.querySelector(".users")
const roomlist=document.querySelector(".users1")
const currentRoom=document.querySelector(".Roomname")





const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
})
console.log(username,room)
const socket= io()

socket.emit("joinroom",{username,room})
socket.on("roomUsers",({room,users})=>{
    getroomname(room)
    getusernames(users)
})
socket.on("chatHistory",(data)=>{
    console.log(data)
    data.forEach(element => {

        showMessage(element,"right")
    });
})
socket.on("takeRooms",(roomData)=>{
    getroomnames(roomData)
  
    console.log(roomData)
    
})
socket.on("message",message=>{
   
    console.log(message)
    showMessage(message,"right")
    window.setInterval(function() {
        var elem = document.getElementById('data');
        msgContainer.scrollTop = msgContainer.scrollHeight;
      }, 100);

})

chatbtn.addEventListener("click",()=>{

const chats=msg.value;
socket.emit("chatMessage",chats)
msg.value=''
})

function showMessage(message,position){
    const div=document.createElement("div")
    div.classList.add("message")
    div.classList.add(position)
    div.innerHTML=`${message.username}: ${message.text}<p id="time">${message.time}</p>`
    msgContainer.appendChild(div)

}

function getroomname(room){
  currentRoom.innerHTML=room
}
function getusernames(users){
    
 userlist.innerHTML=`
 ${users.map(user=>`<div class="list">${user.username}</div>`).join('')}`
 
}
function getroomnames(data){
    roomlist.innerHTML=`
    ${data.map(userm=>`<div class="list"><a class="here" href="//localhost:3000/chat.html?username=${username}&room=${userm.channel}">${userm.channel}</a></div>`).join('')}`
    const showr=document.querySelectorAll(".here")
    
    const thing=Array.from(showr)
    const newarr=[]
    for(let i=1;i<thing.length;i++){
        const vari=thing[i-1]
 
     if(vari.innerHTML===thing[i].innerHTML){
           continue;
     }else{
         newarr.push(thing[i])
     }
        
    }
    console.log(newarr[1].innerHTML)
}