import express from 'express' ;     
import roomModel from '../models/room.js' ;

const router = express.Router() ; 

router.post('/', async (req,res)=>{
const username = req.body.username ; 
const code = req.body.code ; 
try {
   const room = await roomModel.findOne({roomId:code});
   if (!room) return res.send({error:"Room Not Found"}); 
   else {
       console.log(room);   
       res.send({success:"You are ready to go", error:""}) ;
   } 
}
catch(err) {
    res.send(err) ; 
}


});

export default  {router} ; 