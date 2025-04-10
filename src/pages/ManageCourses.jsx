import { useEffect, useState } from "react";
import { apiConnector } from "../services/apiConnector"; // Import API connector
import { adminEndpoints } from "../services/apis";
import { FaEllipsisV } from "react-icons/fa";

const {
    GET_ALL_CREATED_COURSES,
    DELETE_COURSE_API_ADMIN,
} = adminEndpoints;

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [notification, setNotification] = useState(null);

  // Function to fetch courses
  const fetchCourses = async (token) => {
    try {
      const response = await apiConnector("GET", GET_ALL_CREATED_COURSES, {
        Authorization: `Bearer ${token}`,
      });

      console.log("Courses API Response:", response.data);
      setCourses(response.data?.data || []);
    } catch (error) {
      console.error("GET_ALL_COURSES API ERROR:", error);
    }
  };

  const deleteCourse = async (courseId, token) => {
    try {
      await apiConnector("DELETE", `${DELETE_COURSE_API_ADMIN}/${courseId}`, { Authorization: `Bearer ${token}` });
      // setCourses(courses.filter(course => course._id !== courseId));
      setNotification("Category deleted successfully!"); // ✅ Show notification
      setTimeout(() => {
        setNotification(null); // ✅ Hide after 2 seconds
      }, 2000);
      fetchCourses();
    } catch (error) {
      console.error("DELETE_COURSE API ERROR:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
   fetchCourses();
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
  <h1 className="text-3xl font-bold mb-6 text-blue-100 text-center">Manage Courses</h1>

  <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
    <h3 className="text-xl font-semibold mb-4 text-gray-700">Courses</h3>

    {courses.length > 0 ? (
      <ul className="space-y-4">
        {courses.map(course => (
          <li
            key={course._id}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-md shadow-sm hover:shadow-md transition-all"
          >
            <span className="text-gray-700 font-medium">{course.courseName}(By {course.instructor.firstName} - {course.instructor.lastName})</span>
            <div className="relative">
              <FaEllipsisV
                onClick={() => setMenuOpen(menuOpen === course._id ? null : course._id)}
                className="cursor-pointer text-gray-600 hover:text-gray-800"
              />
              {menuOpen === course._id && (
                <div className="absolute right-0 top-full mt-2 bg-white shadow-lg p-2 rounded-md z-10 w-36 border">
                  <button
                    onClick={() => deleteCourse(course._id)}
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
      <p className="text-gray-500 text-center">No courses found.</p>
    )}
  </div>
</div>

  );
};

export default ManageCourses;
