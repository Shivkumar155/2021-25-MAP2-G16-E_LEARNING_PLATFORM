import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-6 p-10">
      <h2 className="text-3xl font-bold text-white">Manage App</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* Manage Users */}
        <button
          onClick={() => navigate("/dashboard/manage-users")}
          className="w-full py-6 text-xl font-semibold bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all"
        >
          Manage Users
        </button>

        {/* Manage Courses */}
        <button
          onClick={() => navigate("/dashboard/manage-courses")}
          className="w-full py-6 text-xl font-semibold bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all"
        >
          Manage Courses
        </button>

        {/* Manage Categories */}
        <button
          onClick={() => navigate("/dashboard/manage-categories")}
          className="w-full py-6 text-xl font-semibold bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all"
        >
          Manage Categories
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;
