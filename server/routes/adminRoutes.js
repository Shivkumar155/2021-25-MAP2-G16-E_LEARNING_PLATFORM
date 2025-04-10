const express = require('express');
const router = express.Router();
const User = require('../models/User');  
const Course = require('../models/Course');  
const { verifyAdmin, auth } = require('../middleware/auth'); 
const Category = require("../models/Category");

router.delete('/delete-user/:id',auth, verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        console.log("id in backend", id)
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
});

router.post("/createCategory", auth, verifyAdmin, async(req, res) => {
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
});
router.get("/showAllCategoryAdmin", auth, verifyAdmin, async(req, res) => {
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
});
router.delete("/deleteCategory/:categoryID", auth, verifyAdmin, async(req, res) => {
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
});

// Delete a course by ID
router.delete('/delete-course/:id',auth, verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await Course.findByIdAndDelete(id);
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting course' });
    }
});



router.get('/getAllUsers',auth, verifyAdmin, async (req, res) => {
    try {
        const users = await User.find({ accountType: { $ne: "Admin" } }, "-password"); // Exclude passwords for security
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    };
});
router.get('/getAllCreatedCourses',auth, verifyAdmin, async (req, res) => {
    try {
        const allCourses = await Course.find({ status: "Published" }).populate("instructor", "firstName lastName");
        return res.status(200).json({
          success: true,
          data: allCourses,
        })
      } catch (error) {
        console.log(error)
        return res.status(404).json({
          success: false,
          message: `Can't Fetch Course Data`,
          error: error.message,
        })
      }
});

module.exports = router;