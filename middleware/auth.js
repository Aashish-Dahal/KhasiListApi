const jwt=require('jsonwebtoken');
module.exports=(req,res,next)=>{
    try {
        var token =req.headers.authorization.split(" ")[1];
       var decoded= jwt.verify(token,'secret');
       req.userData=decoded;
console.log(token);
next();
    } catch (error) {
        res.status(401).json({
            error:"Invalid Token"
        })
    }

}
