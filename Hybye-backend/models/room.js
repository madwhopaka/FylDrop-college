import mongoose from "mongoose" ; 

const Schema = mongoose.Schema ; 

const roomSchema = new Schema ({
    roomId : {type:String, required: true} , 
    host: {type:String, required: true}, 
    activeMembers: {type:Number ,default:0}
},{timestamps: true}); 

const roomModel = mongoose.model('Room', roomSchema) ;    

export default roomModel ; 