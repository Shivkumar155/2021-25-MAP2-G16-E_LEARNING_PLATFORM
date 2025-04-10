import { useEffect, useState } from "react";
import { apiConnector } from "../services/apiConnector"; // Import API connector
import { adminEndpoints } from "../services/apis";
import { FaEllipsisV } from "react-icons/fa";

const {
    GET_ALL_USERS_API,
    DELETE_USER_API
} = adminEndpoints;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [notification, setNotification] = useState(null);

 
  const fetchUsers = async (token) => {
    try {

      const response = await apiConnector("GET", GET_ALL_USERS_API, {
        Authorization: `Bearer ${token}`,
      });

      console.log("Users API Response:", response.data);
      setUsers(response.data || []);
    } catch (error) {
      console.error("GET_ALL_USERS API ERROR:", error);
    }
  };

  const deleteUser = async (userId, token) => {
    console.log("Delete User Clicked, ID:", userId);
    try {
      await apiConnector("DELETE",` ${DELETE_USER_API}/${userId}`, { Authorization: `Bearer ${token}` });
      // setUsers(users.filter(user => user._id !== userId));
      setNotification("User deleted successfully!"); // ✅ Show notification
      setTimeout(() => {
        setNotification(null); // ✅ Hide after 2 seconds
      }, 2000);
      fetchUsers();
    } catch (error) {
      console.error("DELETE_USER API ERROR:", error);
    }
  };

  const handleDeleteUser = (userId) => {
    deleteUser(userId);
  };


  // Fetch data on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-10 bg-gray-100 min-h-screen flex flex-col items-center">
      {/* Notification Message */}
      {notification && (
        <div className="fixed top-[10%] left-[55%] transform -translate-x-[45%] bg-green-600 
                        text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300">
          {notification}
        </div>
      )}

      {/* Page Heading */}
      <h1 className="text-3xl font-bold mb-6 text-blue-100 text-center">Manage Users</h1>

      {/* Users List Section */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Users</h3>

        {users.length > 0 ? (
          <ul className="divide-y divide-gray-300">
            {users.map((user) => (
              <li key={user._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md shadow-sm hover:shadow-md transition-all">
                <span className="text-gray-800">
                  {user.firstName} {user.lastName} <span className="text-gray-500">({user.accountType})</span>
                </span>

                {/* Three Dots & Dropdown Menu */}
                <div className="relative">
                  <FaEllipsisV
                    onClick={() => setMenuOpen(menuOpen === user._id ? null : user._id)}
                    className="cursor-pointer text-gray-600 hover:text-gray-800 "
                  />
                  {menuOpen === user._id && (
                    <div className="absolute right-0 top-full mt-2 bg-white shadow-lg p-2 rounded-md z-10 w-36 border">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
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
          <p className="text-gray-500 text-center">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
