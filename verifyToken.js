const jwt = require("jsonwebtoken");
function verifyToken(req,res,next){
    
    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1]
        jwt.verify(token,"nutrifyAppAsKey",(err , data )=>{
            if(!err){
                next();
            }
            else{
                res.send({message:"token is incorrect"})
            }
        })
    }
    else{
        res.send({message:"send a token"})
    }
}

module.exports = verifyToken