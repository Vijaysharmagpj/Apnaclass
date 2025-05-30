const jwt = require('jsonwebtoken');
require("dotenv").config();
const User=require("../models/User");

// auth

exports.auth=(req,res,next)=>{
    try {
        //extract token
        const token=req.cookie.token || req.body.token || req.header("Authorisation").replace("Bearer ","");
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing",
            })
        }
        // verify the token
        try {
            const decode=jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode)
            req.User=decode;
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"Token is invalid!"
            })
        }
        next()
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success:true,
            message:"Something went wrong while validating the token",
        })
    }
}

// isStudent
exports.isStudent=async(req,res,next)=>{
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for student only",
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified. Please try again"
        })
    }
}

//isInstructor
exports.isInstructor=async(req,res,next)=>{
    try {
        if(req.user.accountType!=="Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor only",
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified. Please try again",
        })
    }
}

// isAdmin
exports.isAdmin=async(req,res,next)=>{
    try {
        if(req.user.accountType!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin only"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified.Please try again",
        })
    }
}
