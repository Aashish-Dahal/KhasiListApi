const express=require('express');
const khasiModel=require('../models/khasi.model');
const { request } = require('express');
const router=express.Router();
var multer=require('multer');
var checkAuth=require('../middleware/auth')
// var upload=multer({dest:'public/uploads/'});

const fileFilter=(req, file, cb)=>{
    if(file.mimetype==='image/jpeg' ||file.mimetype==='image/jpg' || file.mimetype==='image/png'){
        cb(null,true);
    }else{
        cb(null,false);
    }

}
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  });
  var upload=multer({storage:storage,limits:{
    fileSize:1024*1024*5
     },
     fileFilter:fileFilter,
});


/*-----Handling Get requests----------*/

router.get('/',(req,res,next)=>{
    khasiModel.find()
    .select('_id title category short_description estimated_weight color daat owner_name address primary_contact_no secondary_contact_no age khasiImage')
    .exec()
    .then(docs=>{
        const response={
            count:docs.length,
            khasiList:docs
        };
        res.status(200).json(response);
    })
    .catch(err=>{
        //500:-Internal Server Error
        res.status(500).json({
            error:err,
        })
    });
})
/*--------------end-------------*/

/*-----Handling Post requests----------*/

// router.post('/',upload.single('khasiImage'),checkAuth,(req,res,next)=>{
    router.post('/',upload.single('khasiImage'),(req,res,next)=>{
    console.log(req.userData);
    const khasiLists=new khasiModel({
          title:req.body.title,
          category:req.body.category,
          short_description:req.body.short_description,
          estimated_weight:req.body.estimated_weight,
          color:req.body.color,
          daat:req.body.daat,
          owner_name:req.body.owner_name,
          address:req.body.address,
          primary_contact_no:req.body.primary_contact_no,
          secondary_contact_no:req.body.secondary_contact_no,
          age:req.body.age,
          khasiImage:req.file.path,
    });
    khasiLists.save()
    .then(result=>{
       console.log(result);
       res.status(201).json({
        msg:'Created product successfilly',
        khasiList:{
            id:result._id,
            title:result.title,
            category:result.category,
            short_description:result.short_description,
            estimated_weight:result.estimated_weight,
            color:result.color,
            daat:result.daat,
            owner_name:result.owner_name,
            address:result.address,
            primary_contact_no:result.primary_contact_no,
            secondary_contact_no:result.secondary_contact_no,
            age:result.age,
            khasiImage:result.khasiImage,
            request:{
                type:"Get",
                url:"http://localhost:3000/khasiLists/"+result._id,
            }
        }
       
    });
    })
    .catch(err=>{
        console.log(err);
           //500:-Internal Server Error
           res.status(500).json({
            error:err,
        })
    });

});
/*--------------end-------------*/

/*-----Handling Get requests through id----------*/

router.get('/:khasiListId',(req,res,next)=>{
    const id=req.params.khasiListId;
    khasiModel.findById(id)
    .select('_id title category short_description estimated_weight color daat owner_name address primary_contact_no secondary_contact_no age khasiImage') 
    .exec()
    .then(doc=>{
        if(doc)
        {
        res.status(200).json({
            khasiList:'Get',
            request:{
                 type:'Get',
                 url:"http://localhost:3000/khasiLists"
                 
            }
        });
        }else{
            res.status(404).json({
                message:"No valid entry found for provided ID!!"
            })
        }
    })
    .catch(err=>{
        //500:-Internal Server Error
        res.status(500).json({
            error:err,
        })
    });

});
/*--------------end-------------*/

/*-----Handling patch requests through id----------*/

router.patch('/:khasiListId',(req,res,next)=>{
    const id=req.params.khasiListId;
    const updateOps={};
    for(const ops of req.body)
    {
        updateOps[ops.khsiList]=ops.value;
    }
    khasiModel.update({_id:id},{$set:updateOps})
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message:'khasiList updated',
            request:{
                type:'Get',
                url:"http://localhost:3000/khasiLists/"+id,
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err,
        })
    });
    
    
   
})
/*--------------end-------------*/

/*-----Handling delete requests through id----------*/

router.delete('/:khasiListId',(req,res,next)=>{
  const id=req.params.khasiListId;
    khasiModel.findByIdAndDelete({_id: id})
    .exec()
    .then(result=>{
        res.status(200).json({
            msg:'khasiList Deleted',
            request:{
                type:'Post',
                url:"http://localhost:3000/khasiLists/"
            }
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err,
        })
    })
   
})
/*--------------end-------------*/

module.exports=router;