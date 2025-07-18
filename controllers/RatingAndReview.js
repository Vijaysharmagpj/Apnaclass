const RatingAndReview=require("../models/RatingAndReview");
const Course=require("../models/Course");
const { default: mongoose } = require("mongoose");

//create rating
exports.createRating=async(req,res)=>{
    try {
        // get user id
        const userId=req.body.id;
        //fetch data from req body
        const {rating,review,courseId}=req.body;
        //check if user is enrolled or not
        const courseDetails=await Course.findOne({_id:courseId,studentEnrolled:{$elemMatch:{$eq:userId}}});
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Student is not enrolled in the course"
            })
        }
        // check user already review the course
        const alreadyReviewed=await RatingAndReview.findOne({user:userId,course:courseId})
                if(!alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"Course is already review by the user"
            })
        }
        //create rating and review
        const ratingReview= await RatingAndReview.create({rating,review,course:courseId,user:userId})
        //update course with this rating and review
        const updatedCourseDetails=await Course.findByIdAndUpdate({_id:courseId},{$push:{ratingAndReview:ratingReview._id}},{new:true});
        console.log(updatedCourseDetails)
        //return response
        return res.status(200).json({
            success:true,
            message:"Rating and review successfully",
            ratingReview,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//getAverageRating
exports.getAverageRating= async(req,res)=>{
    try {
        // get course id
        const courseId=req.body.courseId;
        //calculate average rating
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId),
                }
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg: "$rating"},
                }
            }
        ])

        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }
        //if no rating review
        return res.status(200).json({
            success:true,
            message:"Average rating zero no rating given till now",
            averageRating:0,
        })

        //return rating 
    } catch (error) {
            console.log(error);
            return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//getAllRatingandreview
exports.getAllRating =async(req,res)=>{
    try {
        const allReview=await RatingAndReview.find({}).sort({rating:"desc"}).populate({path:"user",select:"firstName lastName email image"}).populate({path:"course",select:"courseName"}).exec();
        return res.status(200).json({
            success:true,
            message:"All review fecth successfully",
            data:allReview
        })
    } catch (error) {
            console.log(error);
            return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}