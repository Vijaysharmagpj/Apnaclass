const Tag=require("../models/tags");


//create tags a handler function likhna h 

exports.createTag=async(req,res)=>{
    try {
        //fetch data
        const {name,description}=req.body;
        //validation
        if(!name||!description){
            return res.status(400).json({
                success:false,
                message:"all fields are required"
            })
        }
        //create entry in DB
        const tagDetail=await Tag.create({name:name,description:description});
        console.log(tagDetail);
        //return response
        return res.status(200).json({
            success:true,
            message:"Tag created successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//get all tags

exports.showAllTag=async(req,res)=>{
    try {
        const allTags=await Tag.find({},{name:true,description:true});
        return res.status(200).json({
            success:true,
            message:"All tags returned successfully",
            allTags,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}