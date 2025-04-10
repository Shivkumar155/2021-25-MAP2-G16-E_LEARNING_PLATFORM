import { useEffect, useState } from "react";
import { apiConnector } from "../services/apiConnector"; // Import API connector
import { adminEndpoints } from "../services/apis";
import { FaEllipsisV } from "react-icons/fa";

const {
    CREATE_CATEGORY,
    SHOW_ALL_CATEGORY_ADMIN,
    DELETE_CATEGORY
} = adminEndpoints;

const ManageCategories = () => {
  const [menuOpen, setMenuOpen] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [notification, setNotification] = useState(null);


  const handleCategoryChange = (event) => {
    setNewCategory(event.target.value || ""); // Ensures it's always a string
  };
  
  const handleDescriptionChange = (event) => {
    setCategoryDescription(event.target.value || "");
  };

  const fetchCategories = async (token) => {
    try {
      const response = await apiConnector("GET", SHOW_ALL_CATEGORY_ADMIN, {
        Authorization: `Bearer ${token}`,
      });
      console.log("categoy get API Response:", response.data.data);
      setCategories(response.data?.data || []);
    } catch (error) {
      console.error("GET_ALL_CATEGORIES API ERROR:", error);
    }
  };

  const createCategory = async (token) => {
    if (typeof newCategory !== "string" || newCategory.trim() === "") {
      alert("Please enter a valid category name.");
      return;
    }
    try {
      await apiConnector("POST", CREATE_CATEGORY, { 
        name: newCategory.trim(), 
        description: categoryDescription.trim() 
      }, {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      });

      // alert("Category created successfully");
      setNotification("Category Created successfully!"); // ✅ Show notification
      setTimeout(() => {
        setNotification(null); // ✅ Hide after 2 seconds
      }, 2000);
      setNewCategory("");
      setCategoryDescription("");
      fetchCategories(); // Refresh category list
    } catch (error) {
      console.error("CREATE_CATEGORY API ERROR:", error);
    }
  };

  const deleteCategory = async (categoryID, token) => {
    try {
      await apiConnector("DELETE", `${DELETE_CATEGORY}/${categoryID}`, {
        Authorization: `Bearer ${token}`,
      });

      // alert("Category deleted successfully");
      setNotification("Category deleted successfully!"); // ✅ Show notification
      setTimeout(() => {
        setNotification(null); // ✅ Hide after 2 seconds
      }, 2000);
      fetchCategories(); // Refresh category list
    } catch (error) {
      console.error("DELETE_CATEGORY API ERROR:", error);
    }
  };


  // Fetch data on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
  {/* Notification */}
  {notification && (
    <div className="fixed top-[10%] left-[55%] transform -translate-x-[45%] bg-green-600 
                        text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300">
      {notification}
    </div>
  )}

  {/* Header */}
  <h1 className="text-3xl font-bold mb-6 text-blue-100">Manage Categories</h1>

  {/* Categories Section */}
  <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
    <h3 className="text-lg font-semibold mb-4 text-gray-700">Categories</h3>
    
    {categories.length > 0 ? (
      <ul className="space-y-3">
        {categories.map(category => (
          <li
            key={category._id}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-md shadow-sm hover:shadow-md transition-all"
          >
            <span className="text-gray-700 font-medium">{category.name}</span>
            <div className="relative">
              <FaEllipsisV
                onClick={() => setMenuOpen(menuOpen === category._id ? null : category._id)}
                className="cursor-pointer text-gray-600 hover:text-gray-800 text-xl"
              />
              {menuOpen === category._id && (
                <div className="absolute right-0 top-full mt-2 bg-white shadow-lg p-2 rounded-md z-10 w-36 border">
                  <button
                    onClick={() => deleteCategory(category._id)}
                    className="block w-full text-left text-red-500 hover:text-red-700 px-2 py-2 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 text-center">No categories found.</p>
    )}
  </div>

  {/* Create Category Section (Now Below the Categories List) */}
  <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg mt-6">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">Create Category</h3>
    <input
      type="text"
      value={newCategory}
      onChange={handleCategoryChange}
      placeholder="Category Name"
      className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <input
      type="text"
      value={categoryDescription}
      onChange={handleDescriptionChange}
      placeholder="Description"
      className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      onClick={createCategory}
      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Create
    </button>
  </div>
</div>

  );
};

export default ManageCategories;
