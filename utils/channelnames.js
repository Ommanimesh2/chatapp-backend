const mongoose=require("mongoose")

const channels=new mongoose.Schema({
 
    channel:{
        type:String,
        
        
        
    }
  
    
    

})
const channel=new mongoose.model("channelNames",channels)
module.exports=channel