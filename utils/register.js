const mongoose=require("mongoose")

const newUser=new mongoose.Schema({
    names:{
        type:String,
        required:true,
       
        
    },
    
    channelName:{
        type:String,
        required:true
    }
})
const Register=new mongoose.model("Login",newUser)
module.exports=Register