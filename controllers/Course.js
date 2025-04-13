const Course=require("../models/Course");
const Tag=require("../models/tags");
const User=require("../models/User");
const {uploadImageToCloudinary}=require("../utils/imageUploader");

//create course handler function
exports.createCourse = async (req,res)=>{
    try {
        //fetch data 
        const {courseName,courseDescription,whatYouWillLearn,price,tag}=req.body;
        //get thumbnail;
        const thumbnail=req.files.thumbnailImage;
        //validation 
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }
        //check for instructor
        const userId=req.User.id;
        const instructorDetails= await User.findById(userId);
        console.log(instructorDetails);

        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor details not found"
            })
        }

        //check given tag is valid or not 
        const tagDetails= await Tag.findById(tag);
        if(!tagDetails){
            return res.status(404).json({
                success:false,
                message:"Tag details not found",
            })
        }

        //upload image to cloudinary
        const thumbnailImage=uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)

        // create an entry for new course
        const newCourse= await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url
        })

        //add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id,
                }
            },
            {new:true},
        );

        // update the tag schema
        // HW
        await Tag.findByIdAndUpdate(tag,
            {
                $push: {
                    course: newCourse._id
                }
            })

        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Fail to create course",
            error:error.message,
        })
    }
}


//getAllCourse handler function

exports.showAllCourses= async(req,res)=>{
    try {
        const allCourse=await Course.find({},{courseName:true,price:true,thumbnail:true,instructor:true,ratingAndReview:true,studentEnrolled:true}).populate("instructor").exec();
        return res.status(200).json({
            success:true,
            message:"Data for all courses fetched successfully",
            data:allCourse,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot fetch course data",
            error:error.message,
        })
    }
}
