const Section=require("../models/Section");
const Course=require("../models/Course");

exports.createSection= async (req,res)=>{
    try {
        //fetch data from req body
        const {sectionName,courseId}=req.body;
        // data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            })
        }
        // create section
        const newSection=await Section.create({sectionName});
        // update course with section objectId 
        const updatedCourseDetails=await Course.findByIdAndUpdate(courseId,{
            $push:{
                courseContent:newSection._id
            }
        },{new:true}).populate({
            path:"courseContent",
            populate: {
                path:"subSection"
            }});
        //return response successfull
        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            updatedCourseDetails,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to create section, Please try again",
            error:error.message,
        })
    }
}

//update a section 

exports.updateSection = async (req,res)=>{
    try {
        // fetch the data from req
        const {sectionName,sectionId}=req.body;
        //data validation 
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties to update section" 
            })
        }
        //data update
        const section=await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});
        // return response        
        return res.status(200).json({
            success:true,
            message:"Section Update Successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to update section, Please try again",
            error:error.message,
        })
    }
}

exports.deleteSection =async (req,res)=>{
    try {
        //fetch ID
        const {sectionId}=req.params
        //user findByIdAndDelete
        await Section.findByIdAndDelete(sectionId);
        // return res
        return res.status(200).json({
            success:true,
            message:"Section Delete Successfully"
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to delete section, Please try again",
            error:error.message,
        })
    }
}