const express=require('express');
const mongoose=require('mongoose');
const userModel=require('../models/user.model');
const router=express.Router();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

router.post('/login',(req,res,next)=>{
    userModel.find({username:req.body.userName})
    .exec()
    .then(user=>{
        if(user.length<1)
        {
            res.status(404).json({
            
                message:'Auth Failed!',
               
            })
        
        }else{
            bcrypt.compare(req.body.password,user[0].password,function(err,result){
                if(err){
                    res.status(404).json({
            
                        message:'Auth Failed!',
                       
                    }); 
                }
                if(result)
                {
                   var token= jwt.sign({
                        username:user[0].username,
                        userid:user[0]._id,
                    },'secret',{ expiresIn:"1h"}
                    )
                    res.status(201).json({
                        
                        message:'User found!!',
                        token:token,
                    })
                }else{
                    res.status(404).json({
            
                        message:'Auth Failed!',
                       
                    }); 
                }
            })
     
    }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err,
        })
    })
})

router.post('/signup',(req,res,next)=>{
     var username=req.body.username;
     var email=req.body.email;
     var password=req.body.password;
     var confirmPassword=req.body.confirmPassword;
     if(password!==confirmPassword)
     {
         res.json({
             message:"Password Not Matched!!"
           
         })
     }else{
        bcrypt.hash(req.body.password,10,(err,hash)=>{
            if (err){
                return res.status(500).json({
                    message:"Something Wrong,Try Later!!",
                    error:err,
                })
            }else{
                const user=new userModel({
                    _id:new mongoose.Types.ObjectId(),
                     username:username,
                     email:email,
                     password:hash,
                   
                })
                user.save()
                .then(result=>{
                    res.status(201).json({
                        message:"user created",
                        result:result
                    })
                })
                .catch(err=>{
                    console.log(err);
                    res.status(500).json({
                        error:err,
                    })

                });
            }
            
        })

    }
 })

module.exports=router;