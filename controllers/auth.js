const User = require("../models/user")
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');



exports.signup=(req,res)=>{

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({
            error:errors.array()[0].msg,
            
        })
    }


   const user= new User(req.body)
   user.save((err,user)=>{
    if(err){
        return res.status(400).json({
            err:"Not able to save user in DB"
        })
    };

    res.json({
        name:user.name,
        email:user.email,
        id:user._id
    });
   })
};


exports.signin=(req,res)=>{
    const {email,password}=req.body; //destructure from body

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error:errors.array()[0].msg,
        })
    }

    User.findOne({email},(err,user)=>{

           if(err){
              return res.status(400).json({
                   error:"User email doesnot exist"
               })
           } 
          if(!user.authenticate(password)) {
          return  res.status(401).json({
                error:"User email and password donot match"
            })
          }

            //create token
          const token=jwt.sign({id:user._id},"shhhh")
            //put token in cookie
            res.cookie("token",token,{expire:new Date()+999});

            //send response to frontend
            const {_id,name,email,role }=user;
            return res.Json({token,user:{_id,name,email,role}});

    });


};





exports.signout=(req,res)=>{
    res.json({
        message:"user signout"
    })
}