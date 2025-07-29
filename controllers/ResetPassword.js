const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const bcrypt=require("bcrypt")

// resetpassword token
exports.resetPasswordToken=async(req,res)=>{
   try {
     //get email from req body

     const email=req.body.email;

     //check user for this email,email validation
     const user=await User.findOne({email});
     if(!user){
         return res.status(400).json({
             success:false,
             message:"Your Email is not resistered with us",
         })
     }
     //generate token
     const token = crypto.randomUUID();
     console.log(token,"token reset password")
     //user update by adding token and expireation time
     const updatedDetail= await User.findOneAndUpdate({email:email},{token,resetPasswordExpire:Date.now()+5*60*1000},{new:true});
     //create url
     const url=`http://localhost:3000/update-password/${token}`;
     //send mail containing the url
     await mailSender(email,"Password Reset Link",`Password Reset Link ${url}`);
     //return response
     return res.status(200).json({
         success:true,
         message:"Email send Successfully, Please Check email and change Password!",
     })
   } catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"Something went wrong while reset Password"
    })
   }
}

// resetpassword
exports.resetPassword=async(req,res)=>{
    try {
        //fetch data from req
        const {password,confirmPassword,token}=req.body;
        //validation
        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password not match",
            })
        }
        //get user details from db using token
        const userDetail=await User.findOne({token:token});
        //if not entry invalid token
        if(!userDetail){
            return res.status(400).json({
                success:false,
                message:"Token Invalid!"
            })
        }
        //token time check
        if(userDetail.resetPasswordExpires<Date.now()){
            return res.status(400).json({
                success:false,
                message:"Token is expired,Please regenerate your token",
            })
        } 
        // password hash
        const hashedPassword= await bcrypt.hash(password,10);
        // update password
        await User.findOneAndUpdate({token},{password:hashedPassword},{new:true});
        // return res
        return res.status(200).json({
            success:true,
            message:"Reset Password Successfully!",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while reset password",
        })
    }
}
