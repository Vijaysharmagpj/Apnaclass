const Profile=require("../models/Profile");
const User=require("../models/User");

exports.updateProfile=async(req,res)=>{
    try {
        //get data
        const {dateOfBirth="",about="",contactNumber,gender}=req.body;
        // get user id
        const id=req.user.id;
        //validation
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }
        //find profile
        const userDetails=await User.findById(id);
        const profileId=userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        //update profile
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about=about;
        profileDetails.gender=gender;
        profileDetails.contactNumber=contactNumber;
        await profileDetails.save();
        // return res
        return res.status(200).json({
            success:true,
            message:"Profile update successfully",
            profileDetails,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something went wrong while updating a profile",
            error:error.message,
        })
    }
};


//Acount delete
// Explore-how can we schedule this delete operation 

exports.deleteAccount = async(req,res)=>{
    try {
        //get id
        const id=req.user.id
        // validation 
        const userDetails=await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User not found",
            })
        }
        // delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //TOOD: HW unenroll user form all enrolled courses
        // delete user
        await User.findByIdAndDelete({_id:id});
        // return res
        return res.status(200).json({
            success:true,
            message:"User Delete Successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User cannot delete successfully",
        })
    }
}

//get all user details
exports.getAllUserDetails = async(req,res)=>{
    try {
        //get id
        const id=req.user.id;
        //validation and get user detail
        const userDetails=await User.findById(id).populate("additionalDetails").exec();

        //return res
        return res.status(200).json({
            success:true,
            message:"User Data fetched successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}