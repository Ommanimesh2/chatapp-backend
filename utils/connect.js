const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/LoginData",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    
    
}).then(()=>{
    console.log("hogoaya")
}).catch((e)=>{
    console.log(e)
})