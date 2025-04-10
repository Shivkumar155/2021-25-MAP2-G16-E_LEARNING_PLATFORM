const Category = require("../models/Category")

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" })
    }
    const CategorysDetails = await Category.create({
      name: name,
      description: description,
    })
    console.log(CategorysDetails)
    return res.status(200).json({
      success: true,
      message: "Categorys Created Successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    })
  }
}

exports.showAllCategories = async (req, res) => {
  try {
    const allCategorys = await Category.find()
    res.status(200).json({
      success: true,
      data: allCategorys,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    const { categoryID } = req.params;

    // Check if category ID is provided
    if (!categoryID) {
      return res.status(400).json({ success: false, message: "Category ID is required" });
    }

    // Find and delete category
    const deletedCategory = await Category.findByIdAndDelete(categoryID);

    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      deletedCategory,
    });
  } catch (error) {
    console.error("DELETE_CATEGORY ERROR:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body

    // Get courses for the specified category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec()

    console.log("SELECTED COURSE", selectedCategory)
    // Handle the case when the category is not found
    if (!selectedCategory) {
      console.log("Category not found.")
      return res
        .status(404)
        .json({ success: false, message: "Category not found" })
    }
    // console.log("p1")
    // Handle the case when there are no courses
    if (selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected category.")
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      })
    }
    // console.log("p2")
    // Get courses for other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    })
    // console.log("p3")
    // let differentCategory = await Category.findOne(
    //   categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id
    // ).populate({
    //     path: "courses",
    //     match: { status: "Published" },
    //   }).exec()
    // console.log()
    // console.log("p4")
    // // Get top-selling courses across all categories
    // const allCategories = await Category.find()
    //   .populate({
    //     path: "courses",
    //     match: { status: "Published" },
    //   })
    //   .exec()
    // const allCourses = allCategories.flatMap((category) => category.courses)
    // const mostSellingCourses = allCourses
    //   .sort((a, b) => b.sold - a.sold)
    //   .slice(0, 10)

    res.status(200).json({
      success: true,
      data: {
        selectedCategory
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
