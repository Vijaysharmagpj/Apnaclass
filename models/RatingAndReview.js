const mongoose = require("mongoose");


const ratingAndReviewSchema=new mongoose.Schema({
    User:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    rating:{
        type:Number,
        required:true,
    },
    review:{
        type:String,
        required:true,
        trim:true,
    }
})

module.exports=mongoose.model("RatingAndReview",ratingAndReviewSchema)