const mongoose=require("mongoose")

const chatHistory=new mongoose.Schema({
    username:{
        type:String,
        
    },

    text:{
        type:String
    },
    time:{
        type:String
    },
    channel:{
        type:String
    }
  
    
    

})
const viewChat=new mongoose.model("log",chatHistory)
module.exports=viewChat