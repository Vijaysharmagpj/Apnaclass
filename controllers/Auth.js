const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator=require("otp-generator");
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');
require("dotenv").config()

//send OTP
exports.sendOTP = async (req, res) => {
  try {
    // fetch email from req ki body
    const { email } = req.body;

    //check user already exist or not
    const checkUserPresent = await User.find({ email });

    //if user already exist,then return a response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User Already registered",
      });
    }

    //generate OTP
    var otp=otpGenerator.generate(6,{
      upperCaseAlphabets:false,
      lowerCaseAlphabets:false,
      specialChars:false,
    })
    console.log("OTP Generate",otp);

    //check unique otp or not
    let result=await OTP.findOne({otp:otp});
    while(result){
      otp=otpGenerator(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
      })
      result=await OTP.findOne({otp:otp});
    }
    const otpPayload={email,otp};

    //create an entry in DB for OTP
    const otpBody=await OTP.create(otpPayload);
    console.log(otpBody);
    res.status(200).json({
      success:true,
      message:"OTP Send Successfully",
      otp,
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success:false,
      message:error.message,
    })
  }
};

//sign up
exports.signUp= async(req,res)=>{
  try {
    //data fetch from req body
    const {firstName,lastName,email,password,confirmPassword,accountType,contactNumber,otp,}=req.body;
    //validate data
    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
      return res.status(403).json({
        success:false,
        message:"All Fields are required",
      })
    }

    //2 password match
    if(password!==confirmPassword){
      return res.status(400).json({
        success:false,
        message:"Password and Confirm Password Value does not match,Please try again",
      })
    }

    //check user already exist or not
    const existingUser=await User.findOne({email});
    if(existingUser){
      return res.status(400).json({
        success:false,
        message:"User is already registered",
      })
    }
    
    //find most recent OTP store for the user
    const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
    console.log("recentOTP",recentOtp); 

    //validate OTP
    if(recentOtp.length==0){
      //OTP not found
      return res.status(400).json({
        success:false,
        message:"OTP Not Found"
      })
    }else if(otp!=recentOtp){
      return res.status(400).json({
        success:false,
        message:"invalid OTP"
      });
    }
    //hash password
    const hashedPassword=await bcrypt.hash(password,10);

    //create entry in DB

    
    const ProfileDetails= await Profile.create({
      gender:null,
      dateOfBirth:null,
      about:null,
      contactNumber:null,
    })

    const user=await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password:hashedPassword,
      accountType,
      additionalDetails:ProfileDetails._id,
      image:`http://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
    })
    //return res
    return res.status(200).json({
      success:true,
      message:"User is registered successfully",
      user,
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"User can't be registered. Please try again!"
    })
  }
}

//Login

exports.login=async(req,res)=>{
  try {
    
    //get data from req body
    const {email,password}=req.body
    //validation data
    if( !email || !password){
      return res.status(403).json({
        success:false,
        message:"all feild are required. Please try again",
      })
    }
    // user check exist or not
    const user=await User.findOne({email}).populate(" additionalDetails");
    if(!user){
      return res.status(401).json({
        success:false,
        message:"User is not registered, Please signup first!"
      })
    }
    //generate JWT token,after password match
    if(await bcrypt.compare(password,user.password)){
      const payload={
        email:user.email,
        id:user._id,
        accountType:user.accountType,
      }
      const token= jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:"2h",
      })
      user.token=token;
      user.password=undefined;

        //create cookie and send response
        const options={
          expires:new Date(Date.now()+3*24*60*60*1000),
          httpOnly:true,
        }
        res.cookie("token",token,options).status(200).json({
          success:true,
          token,
          user,
          message:"Logged in successfully!"
        })
    }else{
      return res.status(401).json({
        success:false,
        message:"Password is incorrect",
      })
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Login Failure, Please try again",
    })
  }
}

// change password

exports.changePassword=async(req,res)=>{
  //get data from req body
  //get old password and new password and confirm new password
  //validation
  //update password in DB
  //send mail-password update
  //return response 
}
