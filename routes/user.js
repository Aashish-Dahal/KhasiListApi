const express=require('express');
const mongoose=require('mongoose');
const userModel=require('../models/user.model');
const router=express.Router();
const bcrypt=require('bcrypt');

router.post('/login',(req,res,next)=>{
    userModel.find({username:req.body.userName})
    .exec()
    .then(result=>{
        if(result.length<1)
        {
            res.status(201).json({
            
                message:'User not found!!',
               
            })
        
        }else{
        console.log(result)
        res.status(201).json({
            
            message:'User found!!',
            data:result,
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