const path =require("path")
const express=require("express")
const http =require("http")
const socketio=require("socket.io")
const Register=require("./utils/register")
const viewChat=require("./utils/chatSchema")
const channel=require("./utils/channelnames")
require("./utils/connect")

const formatMessage = require("./utils/messages")
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./utils/user')
const { redirect } = require("express/lib/response")
const app=express()
const server =http.createServer(app);
const io =socketio(server);
app.use(express.json())
app.use(express.urlencoded({extended:false}))



io.on("connection", socket=>{
  

    socket.on("chatMessage",(chats)=>{
       try {
           const user= getCurrentUser(socket.id)
           const newmess=new viewChat(
               {
                   username:user.username,
                   text:formatMessage(user.username,chats).text,
                    time:formatMessage(user.username,chats).time,
                    channel:user.room
               }
           )
           newmess.save()
           console.log(newmess)
        io.to(user.room).emit("message",formatMessage(user.username,chats))
       } catch (error) {
           
       }
        
  
    })
  
    socket.on("joinroom",({username,room})=>{
        const user=userJoin(socket.id,username,room);
        
        try {
            const newChannel=new channel({
                channel:user.room
            })
            
            newChannel.save()
            console.log(newChannel)
        } catch (error) {
            
        }
        socket.join(user.room)
        channel.find().then((groups)=>{
            io.to(user.room).emit("takeRooms",groups)
        })
        viewChat.find({channel:user.room}).then((docs)=>{
            io.to(user.room).emit("chatHistory",docs)
          })
         
        
    socket.emit("message",formatMessage("Admin","You have joined this chat"))

    socket.broadcast.to(user.room).emit("message",formatMessage("Admin",`${user.username} joined`))
    io.to(user.room).emit("roomUsers",{
     room:user.room,
     users:getRoomUsers(user.room)
    })
})
    socket.on("disconnect",()=>{
        const user=userLeave(socket.id)
        if(user){

            io.to(user.room).emit("message",formatMessage("Admin",`${user.username} has left the chat`))
            io.to(user.room).emit("roomUsers",{
                room:user.room,
                users:getRoomUsers(user.room)
            })
        }
    })    
})
app.get("/index",(req,res)=>{
    res.send("index")
})
app.get("/chat",(req,res)=>{
    res.send("chat")
})
app.post("/index",async (req,res)=>{
    try {
        const newRegisters=new Register({
            names:req.body.username,            
            channelName: req.body.room        
        })
               
            const now=await newRegisters.save();
            res.redirect(`//localhost:3000/chat.html?username=${req.body.username}&room=${req.body.room}`)
            console.log(now)
        
        
    } catch (error) {
        console.log(error)
    }
})

const PORT=3000 || process.env.PORT
app.use(express.static(path.join(__dirname,'public')))
server.listen(PORT,()=>console.log(`server on ${PORT}`))