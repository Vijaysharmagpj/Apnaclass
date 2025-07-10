const Category = require("../models/Category");

//create Category  a handler function likhna h

exports.createCategory = async (req, res) => {
  try {
    //fetch data
    const { name, description } = req.body;
    //validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }
    //create entry in DB
    const CategoryDetail = await Category.create({
      name: name,
      description: description,
    });
    console.log(CategoryDetail);
    //return response
    return res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get all Category 

exports.showAllCategory = async (req, res) => {
  try {
    const allCategory = await Category.find(
      {},
      { name: true, description: true }
    );
    return res.status(200).json({
      success: true,
      message: "All Category returned successfully",
      allCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//category page details
exports.categoryPageDetails=async(req,res)=>{
  try {
    //get category id
    const {categoryId}=req.body;
    //get course for specified category id
    const selectedcategory=await Category.findById({categoryId}).populate("course").exec();
    // validation
    if(!selectedcategory){
      return res.status(404).json({
        success:false,
        message:"Data not found"
      })
    }
    // get course for diffrent Category 
    const diffrentCategory=await Category.find({
      _id:{$ne:categoryId},
    }).populate("course").exec();
    // get top selling courses
          const allCategories = await Category.find()
        .populate({
          path: "course",
          match: { status: "Published" },
          populate: "ratingAndReviews",
        })
        .exec()
      const allCourses = allCategories.flatMap((category) => category.course)
      const mostSellingCourses = await Course.find({ status: 'Published' })
      .sort({ "studentsEnrolled.length": -1 }).populate("ratingAndReviews") 
      .exec();
      console.log(allCourses);

    //return res
    res.status(200).json({
      success:true,
			selectedCourses: selectedCourses,
			differentCourses: differentCourses,
			mostSellingCourses,
            name: selectedCourses.name,
            description: selectedCourses.description,
            success:true
		})
  } catch (error) {
      console.log(error);
      return res.status(500).json({
      success:false,
      message:error.message,
        })
  }
}