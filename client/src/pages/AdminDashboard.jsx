import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  MessageCircle,
  TrendingUp,
  Search,
  Eye,
  Trash2,
  Download,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  Star,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAlert } from "../context/AlertContext";
import { useAuth } from "../context/AuthContext";
import HeaderComponent from "../components/HeaderComponent";

// Users Management Component
const UsersManagement = ({ users, onRefresh, handleDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { showAlert } = useAlert();

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      (filterType === "active" && user.status === "active") ||
      (filterType === "inactive" && user.status === "inactive") ||
      (filterType === "coached" && user.coachId) ||
      (filterType === "uncoached" && !user.coachId);
    return matchesSearch && matchesFilter;
  });

  const openModal = (user = null) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
        >
          <option value="all">All Users</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="coached">With Coach</option>
          <option value="uncoached">Without Coach</option>
        </select>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user._id}
            className="bg-white/80 backdrop-blur-xl shadow-lg rounded-xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {user.fullname}
                  </h3>
                  <p className="text-sm text-slate-600">{user.email}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                    {user.coachId && (
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
                        Coached by {user.coachName || "Coach"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">
                      {user.totalInterviews}
                    </p>
                    <p className="text-xs text-slate-600">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">
                      {user.completedInterviews}
                    </p>
                    <p className="text-xs text-slate-600">Completed</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-lg font-bold text-slate-800">
                        {user.averageRating}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">Rating</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(user)}
                    className="p-2 text-slate-600 hover:text-indigo-600 transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="p-2 text-slate-600 hover:text-red-600 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-800">
                {selectedUser
                  ? `User Details: ${selectedUser.fullname}`
                  : "Add New User"}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Full Name
                    </label>
                    <p className="text-slate-800">{selectedUser.fullname}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <p className="text-slate-800">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Status
                    </label>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        selectedUser.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedUser.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Coach Status
                    </label>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        selectedUser.coachId
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {selectedUser.coachId ? "Assigned" : "Unassigned"}
                    </span>
                  </div>
                </div>
                {selectedUser.coachName && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Coach Name
                    </label>
                    <p className="text-slate-800">{selectedUser.coachName}</p>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-slate-800">
                      {selectedUser.totalInterviews}
                    </p>
                    <p className="text-sm text-slate-600">Total Interviews</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {selectedUser.completedInterviews}
                    </p>
                    <p className="text-sm text-slate-600">Completed</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-2xl font-bold text-slate-800">
                        {selectedUser.averageRating}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">Average Rating</p>
                  </div>
                </div>
                {selectedUser.sessions && selectedUser.sessions.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Recent Sessions
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedUser.sessions
                        .slice(0, 5)
                        .map((session, index) => (
                          <div
                            key={index}
                            className="p-3 bg-slate-50 rounded-lg"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                {session.type || "General"} Interview
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  session.isComplete
                                    ? "bg-green-100 text-green-700"
                                    : "bg-orange-100 text-orange-700"
                                }`}
                              >
                                {session.isComplete
                                  ? "Completed"
                                  : "In Progress"}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600">
                              {new Date(session.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Coaches Management Component
const CoachesManagement = ({ coaches, onRefresh, handleDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [showModal, setShowModal] = useState(false);

  console.log("loaded coaches", coaches);

  const filteredCoaches = !searchTerm
    ? coaches
    : coaches.filter((coach) => {
        const name = coach.fullname?.toLowerCase() || "";
        const email = coach.email?.toLowerCase() || "";
        return (
          name.includes(searchTerm.toLowerCase()) ||
          email.includes(searchTerm.toLowerCase())
        );
      });

  const openModal = (coach = null) => {
    setSelectedCoach(coach);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCoach(null);
  };

  const displayCoaches = filteredCoaches.map((coach, index) => (
    <motion.div
      key={index}
      className="bg-white/80 backdrop-blur-xl shadow-lg rounded-xl p-6 border border-white/20"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <UserCheck className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              {coach.fullname}
            </h3>
            <p className="text-sm text-slate-600">{coach.email}</p>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium mt-1 inline-block ${
                coach.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {coach.status}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div className="text-center">
              <p className="text-lg font-bold text-slate-800">
                {coach.assignedUsers.length}
              </p>
              <p className="text-xs text-slate-600">Users</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">
                {coach.totalFeedbacks}
              </p>
              <p className="text-xs text-slate-600">Feedbacks</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-lg font-bold text-slate-800">
                  {coach.averageRating || 0}
                </span>
              </div>
              <p className="text-xs text-slate-600">Rating</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => openModal(coach)}
              className="p-2 text-slate-600 hover:text-indigo-600 transition-colors duration-200"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(coach._id)}
              className="p-2 text-slate-600 hover:text-red-600 transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  ));

  return (
    <div className="space-y-6">
      {/* Search and Add Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search coaches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Coaches List */}
      <div className="space-y-4">{displayCoaches}</div>

      {/* Coach Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-800">
                {selectedCoach
                  ? `Coach Details: ${selectedCoach.fullname}`
                  : "Add New Coach"}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedCoach && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Full Name
                    </label>
                    <p className="text-slate-800">{selectedCoach.fullname}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <p className="text-slate-800">{selectedCoach.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Status
                    </label>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        selectedCoach.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedCoach.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedCoach.assignedUsers.length}
                    </p>
                    <p className="text-sm text-slate-600">Assigned Users</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {selectedCoach.totalFeedbacks}
                    </p>
                    <p className="text-sm text-slate-600">Total Feedbacks</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-2xl font-bold text-slate-800">
                        {selectedCoach.averageRating || 0}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">Average Rating</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState([]);
  const { user, logout } = useAuth();
  const { showAlert } = useAlert();

  const handleDelete = async (userId) => {
    const token = getToken();

    try {
      const response = await fetch(
        `/api/admin/delete-user/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch");
      }

      console.log("user Deleted successfuly", data);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      setCoaches((prevCoaches) =>
        prevCoaches.filter((coach) => coach._id !== userId)
      );
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  // PDF Export Function
  const exportToPDF = async () => {
    try {
      // Import jsPDF dynamically
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      const currentDate = new Date().toLocaleDateString();
      let yPosition = 20;

      // Title
      doc.setFontSize(20);
      doc.setFont(undefined, "bold");
      doc.text("Admin Dashboard Report", 20, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      doc.text(`Generated on: ${currentDate}`, 20, yPosition);
      yPosition += 20;

      // Overview Statistics
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Overview Statistics", 20, yPosition);
      yPosition += 15;

      doc.setFontSize(11);
      doc.setFont(undefined, "normal");

      const stats = {
        totalUsers: users.length,
        activeUsers: users.filter((u) => u.status === "active").length,
        totalCoaches: coaches.length,
        activeCoaches: coaches.filter((c) => c.status === "active").length,
        totalInterviews: interviews.length,
        completedInterviews: interviews.filter((i) => i.isComplete).length,
        averageCompletionRate:
          users.length > 0
            ? (
                (users.reduce(
                  (sum, u) =>
                    sum + u.completedInterviews / (u.totalInterviews || 1),
                  0
                ) /
                  users.length) *
                100
              ).toFixed(1)
            : 0,
        averageUserRating:
          users.length > 0
            ? (
                users.reduce((sum, u) => sum + (u.averageRating || 0), 0) /
                users.length
              ).toFixed(1)
            : 0,
      };

      const statsText = [
        `Total Users: ${stats.totalUsers} (${stats.activeUsers} active)`,
        `Total Coaches: ${stats.totalCoaches} (${stats.activeCoaches} active)`,
        `Total Interviews: ${stats.totalInterviews} (${stats.completedInterviews} completed)`,
        `Average Completion Rate: ${stats.averageCompletionRate}%`,
        `Average User Rating: ${stats.averageUserRating}/5`,
      ];

      statsText.forEach((text) => {
        doc.text(text, 20, yPosition);
        yPosition += 8;
      });

      yPosition += 10;

      // Interview Distribution
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Interview Distribution", 20, yPosition);
      yPosition += 15;

      doc.setFontSize(11);
      doc.setFont(undefined, "normal");

      const technicalCount = interviews.filter((i) =>
        i.type?.toLowerCase().includes("technical")
      ).length;
      const behavioralCount = interviews.filter((i) =>
        i.type?.toLowerCase().includes("behavioural")
      ).length;
      const mixedCount = interviews.filter((i) =>
        i.type?.toLowerCase().includes("hybrid")
      ).length;

      const distributionText = [
        `Technical Interviews: ${technicalCount} (${
          stats.totalInterviews > 0
            ? ((technicalCount / stats.totalInterviews) * 100).toFixed(0)
            : 0
        }%)`,
        `Behavioral Interviews: ${behavioralCount} (${
          stats.totalInterviews > 0
            ? ((behavioralCount / stats.totalInterviews) * 100).toFixed(0)
            : 0
        }%)`,
        `Mixed/Hybrid Interviews: ${mixedCount} (${
          stats.totalInterviews > 0
            ? ((mixedCount / stats.totalInterviews) * 100).toFixed(0)
            : 0
        }%)`,
      ];

      distributionText.forEach((text) => {
        doc.text(text, 20, yPosition);
        yPosition += 8;
      });

      yPosition += 15;

      // Users Summary Table
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Users Summary", 20, yPosition);
      yPosition += 15;

      // Table headers
      doc.setFontSize(10);
      doc.setFont(undefined, "bold");
      doc.text("Name", 20, yPosition);
      doc.text("Email", 70, yPosition);
      doc.text("Status", 120, yPosition);
      doc.text("Interviews", 150, yPosition);
      doc.text("Rating", 180, yPosition);
      yPosition += 5;

      // Draw line under headers
      doc.line(20, yPosition, 200, yPosition);
      yPosition += 8;

      // Table data
      doc.setFont(undefined, "normal");
      users.slice(0, 20).forEach((user) => {
        // Limit to first 20 users to fit on page
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
          // Redraw headers on new page
          doc.setFont(undefined, "bold");
          doc.text("Name", 20, yPosition);
          doc.text("Email", 70, yPosition);
          doc.text("Status", 120, yPosition);
          doc.text("Interviews", 150, yPosition);
          doc.text("Rating", 180, yPosition);
          yPosition += 5;
          doc.line(20, yPosition, 200, yPosition);
          yPosition += 8;
          doc.setFont(undefined, "normal");
        }

        const userName =
          user.fullname?.length > 20
            ? user.fullname.substring(0, 17) + "..."
            : user.fullname || "N/A";
        const userEmail =
          user.email?.length > 25
            ? user.email.substring(0, 22) + "..."
            : user.email || "N/A";

        doc.text(userName, 20, yPosition);
        doc.text(userEmail, 70, yPosition);
        doc.text(user.status || "N/A", 120, yPosition);
        doc.text(
          `${user.completedInterviews}/${user.totalInterviews}`,
          150,
          yPosition
        );
        doc.text((user.averageRating || 0).toString(), 180, yPosition);
        yPosition += 7;
      });

      yPosition += 15;

      // Coaches Summary Table
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Coaches Summary", 20, yPosition);
      yPosition += 15;

      // Table headers
      doc.setFontSize(10);
      doc.setFont(undefined, "bold");
      doc.text("Name", 20, yPosition);
      doc.text("Email", 70, yPosition);
      doc.text("Status", 120, yPosition);
      doc.text("Users", 150, yPosition);
      doc.text("Feedbacks", 170, yPosition);
      doc.text("Rating", 190, yPosition);
      yPosition += 5;

      // Draw line under headers
      doc.line(20, yPosition, 200, yPosition);
      yPosition += 8;

      // Table data
      doc.setFont(undefined, "normal");
      coaches.forEach((coach) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
          // Redraw headers on new page
          doc.setFont(undefined, "bold");
          doc.text("Name", 20, yPosition);
          doc.text("Email", 70, yPosition);
          doc.text("Status", 120, yPosition);
          doc.text("Users", 150, yPosition);
          doc.text("Feedbacks", 170, yPosition);
          doc.text("Rating", 190, yPosition);
          yPosition += 5;
          doc.line(20, yPosition, 200, yPosition);
          yPosition += 8;
          doc.setFont(undefined, "normal");
        }

        const coachName =
          coach.fullname?.length > 20
            ? coach.fullname.substring(0, 17) + "..."
            : coach.fullname || "N/A";
        const coachEmail =
          coach.email?.length > 25
            ? coach.email.substring(0, 22) + "..."
            : coach.email || "N/A";

        doc.text(coachName, 20, yPosition);
        doc.text(coachEmail, 70, yPosition);
        doc.text(coach.status || "N/A", 120, yPosition);
        doc.text((coach.assignedUsers?.length || 0).toString(), 150, yPosition);
        doc.text((coach.totalFeedbacks || 0).toString(), 170, yPosition);
        doc.text((coach.averageRating || 0).toString(), 190, yPosition);
        yPosition += 7;
      });

      yPosition += 15;

      // Recent Interviews
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Recent Interviews (Last 10)", 20, yPosition);
      yPosition += 15;

      // Table headers
      doc.setFontSize(10);
      doc.setFont(undefined, "bold");
      doc.text("User", 20, yPosition);
      doc.text("Type", 60, yPosition);
      doc.text("Coach", 100, yPosition);
      doc.text("Status", 140, yPosition);
      doc.text("Date", 170, yPosition);
      yPosition += 5;

      // Draw line under headers
      doc.line(20, yPosition, 200, yPosition);
      yPosition += 8;

      // Table data
      doc.setFont(undefined, "normal");
      interviews.slice(0, 10).forEach((interview) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
          // Redraw headers on new page
          doc.setFont(undefined, "bold");
          doc.text("User", 20, yPosition);
          doc.text("Type", 60, yPosition);
          doc.text("Coach", 100, yPosition);
          doc.text("Status", 140, yPosition);
          doc.text("Date", 170, yPosition);
          yPosition += 5;
          doc.line(20, yPosition, 200, yPosition);
          yPosition += 8;
          doc.setFont(undefined, "normal");
        }

        const userName =
          interview.userName?.length > 15
            ? interview.userName.substring(0, 12) + "..."
            : interview.userName || "N/A";
        const interviewType =
          interview.type?.length > 15
            ? interview.type.substring(0, 12) + "..."
            : interview.type || "N/A";
        const coachName =
          interview.coachName?.length > 15
            ? interview.coachName.substring(0, 12) + "..."
            : interview.coachName || "N/A";
        const status = interview.isComplete ? "Complete" : "In Progress";
        const date = new Date(interview.createdAt).toLocaleDateString();

        doc.text(userName, 20, yPosition);
        doc.text(interviewType, 60, yPosition);
        doc.text(coachName, 100, yPosition);
        doc.text(status, 140, yPosition);
        doc.text(date, 170, yPosition);
        yPosition += 7;
      });

      // Coaching Requests
      if (requests.length > 0) {
        yPosition += 15;

        if (yPosition > 240) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(16);
        doc.setFont(undefined, "bold");
        doc.text("Pending Coaching Requests", 20, yPosition);
        yPosition += 15;

        // Table headers
        doc.setFontSize(10);
        doc.setFont(undefined, "bold");
        doc.text("Full Name", 20, yPosition);
        doc.text("Email", 80, yPosition);
        doc.text("Request Date", 140, yPosition);
        yPosition += 5;

        // Draw line under headers
        doc.line(20, yPosition, 200, yPosition);
        yPosition += 8;

        // Table data
        doc.setFont(undefined, "normal");
        requests.forEach((request) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
            // Redraw headers on new page
            doc.setFont(undefined, "bold");
            doc.text("Full Name", 20, yPosition);
            doc.text("Email", 80, yPosition);
            doc.text("Request Date", 140, yPosition);
            yPosition += 5;
            doc.line(20, yPosition, 200, yPosition);
            yPosition += 8;
            doc.setFont(undefined, "normal");
          }

          const requestName =
            request.fullname?.length > 25
              ? request.fullname.substring(0, 22) + "..."
              : request.fullname || "N/A";
          const requestEmail =
            request.email?.length > 25
              ? request.email.substring(0, 22) + "..."
              : request.email || "N/A";
          const requestDate = request.createdAt
            ? new Date(request.createdAt).toLocaleDateString()
            : "N/A";

          doc.text(requestName, 20, yPosition);
          doc.text(requestEmail, 80, yPosition);
          doc.text(requestDate, 140, yPosition);
          yPosition += 7;
        });
      }

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont(undefined, "normal");
        doc.text(`Page ${i} of ${pageCount}`, 180, 285);
        doc.text("Admin Dashboard Report - Confidential", 20, 285);
      }

      // Save the PDF
      const fileName = `admin-dashboard-report-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);

      // Show success message if showAlert is available
      if (typeof showAlert === "function") {
        showAlert("PDF report generated successfully!", "success");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Show error message if showAlert is available
      if (typeof showAlert === "function") {
        showAlert("Error generating PDF report. Please try again.", "error");
      }
    }
  };

  // Safe fetch function with error handling
  const safeFetch = async (url, options = {}) => {
    try {
      console.log(`Making request to: ${url}`);
      const response = await fetch(url, options);

      if (!response.ok) {
        console.error(
          `HTTP ${response.status}: ${response.statusText} for ${url}`
        );
        return null;
      }

      const data = await response.json();
      console.log(`Successfully fetched from ${url}:`, data);
      return data;
    } catch (error) {
      console.error(`Network error for ${url}:`, error);
      return null;
    }
  };

  // Get authentication token
  const getToken = () => {
    try {
      return localStorage.getItem("session");
    } catch (error) {
      console.warn("Error accessing localStorage:", error);
      return null;
    }
  };

  const fetchCoachingRequests = async () => {
    const token = getToken();

    try {
      const response = await fetch(
        "/api/admin/coaching-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch");
      }

      console.log("Coaching requests:", data);
      setRequests(data);
    } catch (err) {
      console.error("Error fetching coaching requests:", err);
    }
  };

  // Fetch data from API
  const fetchData = async () => {
    const token = getToken();

    if (!token) {
      setError("No authentication token found. Please log in again.");
      setLoading(false);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      setError(null);
      setLoading(true);

      // Fetch all users - try different endpoints
      console.log("Fetching all users...");

      const usersData = await safeFetch(
        "/api/admin/users",
        { headers }
      );

      if (usersData && Array.isArray(usersData)) {
        console.log(`Found ${usersData.length} users`);

        // Process users data and calculate interview stats
        const processedUsers = await Promise.all(
          usersData.map(async (user) => {
            // Fetch user's sessions/interviews - try multiple endpoints
            let userSessions = user.sessions;

            const totalInterviews = userSessions?.length;
            const completedInterviews = userSessions?.filter(
              (session) => session.isComplete || session.status === "completed"
            ).length;

            // Calculate average rating from coach feedback
            const ratingsWithFeedback = userSessions
              ?.filter((session) => {
                const rating = session.coachFeedback?.rating;
                return rating && !isNaN(rating);
              })
              .map((session) => session.coachFeedback?.rating);

            const averageRating =
              ratingsWithFeedback?.length > 0
                ? (
                    ratingsWithFeedback.reduce(
                      (sum, rating) => sum + rating,
                      0
                    ) / ratingsWithFeedback.length
                  ).toFixed(1)
                : 0;

            // Handle coach information
            let coachName = null;
            if (user.coachId) {
              if (typeof user.coachId === "object" && user.coachId.fullname) {
                coachName = user.coachId.fullname;
              } else if (typeof user.coachId === "string") {
                // Try to fetch coach details
                const coachData = await safeFetch(
                  `/api/coaches/${user.coachId}`,
                  { headers }
                );
                coachName =
                  coachData?.fullname || coachData?.name || "Unknown Coach";
              }
            }

            return {
              ...user,
              fullname: user.fullname || user.name || "Unknown User",
              email: user.email || "No email",
              totalInterviews,
              completedInterviews,
              averageRating: parseFloat(averageRating),
              status: user.isActive !== false ? "active" : "inactive",
              lastActive: user.lastLoginAt || user.updatedAt || user.createdAt,
              coachName,
              sessions: userSessions, // Store sessions for detailed view
            };
          })
        );

        setUsers(processedUsers);
        console.log("Successfully processed users:", processedUsers.length);
      } else {
        console.warn("No users data received or data is not an array");
        setUsers([]);
      }

      // Fetch all coaches
      console.log("Fetching all coaches...");
      const coachesData = await safeFetch(
        "/api/admin/coaches",
        { headers }
      );

      if (coachesData && Array.isArray(coachesData)) {
        console.log(`Found ${coachesData.length} coaches`);

        setCoaches(coachesData);
        console.log(coaches);
        console.log("Successfully processed coaches:", coachesData.length);
      } else {
        console.warn("No coaches data received");
        setCoaches([]);
      }

      // Fetch all interviews/sessions
      console.log("Fetching all interviews...");
      let interviewsData = await safeFetch(
        "/api/sessions/all",
        { headers }
      );

      // Try alternative session endpoints
      if (!interviewsData) {
        interviewsData = await safeFetch(
          "/api/admin/sessions",
          { headers }
        );
      }

      if (!interviewsData) {
        interviewsData = await safeFetch(
          "/api/interviews",
          { headers }
        );
      }

      if (interviewsData && Array.isArray(interviewsData)) {
        console.log(`Found ${interviewsData.length} interviews`);

        const processedInterviews = interviewsData.map((interview) => {
          const duration =
            interview.completedAt && interview.createdAt
              ? Math.round(
                  (new Date(interview.completedAt) -
                    new Date(interview.createdAt)) /
                    (1000 * 60)
                )
              : null;

          // Handle user information
          const userName =
            interview.user?.fullname ||
            interview.user?.name ||
            interview.userName ||
            "Unknown User";

          // Handle coach information
          const coachName =
            interview.coach?.fullname ||
            interview.coach?.name ||
            interview.coachName ||
            (interview.coachId ? "Coach" : "AI Assistant");

          return {
            _id: interview._id,
            userId: interview.user?._id || interview.userId,
            userName,
            coachId: interview.coach?._id || interview.coachId,
            coachName,
            type: interview.type || interview.interviewType || "General",
            isComplete:
              interview.isComplete || interview.status === "completed",
            rating: interview.coachFeedback?.rating || interview.rating || null,
            createdAt: interview.createdAt,
            completedAt: interview.completedAt,
            duration,
            status:
              interview.status ||
              (interview.isComplete ? "completed" : "in-progress"),
          };
        });

        setInterviews(processedInterviews);
        console.log(
          "Successfully processed interviews:",
          processedInterviews.length
        );
      } else {
        console.warn("No interviews data received");
        setInterviews([]);
      }
      showAlert("Dashboard Loaded successfuly", "success");
    } catch (error) {
      console.error("Error in fetchData:", error);
      setError(`Failed to load dashboard data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (userId) => {
    const token = getToken();

    try {
      const response = await fetch(
        `/api/admin/accept-coaching-request/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to accept request");
      }

      showAlert(`Request accepted: ${data.message}`, "success");

      // Optional: refresh the list or remove the accepted user from state
      setRequests((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("Error accepting request:", error);
      showAlert("Failed to accept request. Please try again.", "error");
    }
  };

  const declineRequest = async (userId) => {
    const token = getToken();

    try {
      const response = await fetch(
        `/api/admin/decline-coaching-request/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to decline request");
      }

      showAlert(`Request declined: ${data.message}`, "info");

      // Optionally remove user from local UI
      setRequests((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error declining request:", error);
      showAlert("Failed to decline request. Please try again.", "error");
    }
  };

  const coachingRequests = requests.map((user, i) => (
    <tr
      key={i}
      className="bg-white border-b border-slate-200 hover:bg-slate-50"
    >
      <td className="px-4 py-3">{user.fullname}</td>
      <td className="px-4 py-3 flex justify-center gap-2">
        <button
          onClick={() => acceptRequest(user._id)}
          className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full"
        >
          Accept
        </button>
        <button
          onClick={() => declineRequest(user._id)}
          className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-full"
        >
          Decline
        </button>
      </td>
    </tr>
  ));

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
    fetchCoachingRequests();
  }, []);
  [users, coaches, interviews];

  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "active").length,
    totalCoaches: coaches.length,
    activeCoaches: coaches.filter((c) => c.status === "active").length,
    totalInterviews: interviews.length,
    completedInterviews: interviews.filter((i) => i.isComplete).length,
    averageCompletionRate:
      users.length > 0
        ? (
            (users.reduce(
              (sum, u) =>
                sum + u.completedInterviews / (u.totalInterviews || 1),
              0
            ) /
              users.length) *
            100
          ).toFixed(1)
        : 0,
    averageUserRating:
      users.length > 0
        ? (
            users.reduce((sum, u) => sum + (u.averageRating || 0), 0) /
            users.length
          ).toFixed(1)
        : 0,
  };

  // Loading display
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-slate-300 border-t-indigo-600 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-slate-600">Loading admin dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100">
      <HeaderComponent user={user} logout={logout} />
      {/* Header */}

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white/80 backdrop-blur-xl mb-10 shadow-lg border-b border-white/20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Admin Dashboard
                </h1>
                <p className="text-slate-600">
                  Manage users, coaches, and interview analytics
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => exportToPDF()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  <Download className="w-4 h-4" />
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex gap-2 bg-white/60 backdrop-blur-sm rounded-xl p-2 border border-white/20">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "users", label: "Users", icon: Users },
              { id: "coaches", label: "Coaches", icon: UserCheck },
              { id: "interviews", label: "Interviews", icon: MessageCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-white/80"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Stats */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-white/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Users</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {stats.totalUsers}
                    </p>
                    <p className="text-xs text-green-600">
                      {stats.activeUsers} active
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-white/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <UserCheck className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Coaches</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {stats.totalCoaches}
                    </p>
                    <p className="text-xs text-green-600">
                      {stats.activeCoaches} active
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-white/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <MessageCircle className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Interviews</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {stats.totalInterviews}
                    </p>
                    <p className="text-xs text-green-600">
                      {stats.completedInterviews} completed
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-white/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Completion Rate</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {stats.averageCompletionRate}%
                    </p>
                    <p className="text-xs text-slate-600">
                      Average rating: {stats.averageUserRating}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <motion.div
                className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-white/20"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-slate-800">
                    Interview Distribution
                  </h3>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      type: "Technical",
                      count: interviews.filter((i) =>
                        i.type?.toLowerCase().includes("technical")
                      ).length,
                      color: "blue",
                    },
                    {
                      type: "Behavioral",
                      count: interviews.filter((i) =>
                        i.type?.toLowerCase().includes("behavioural")
                      ).length,
                      color: "green",
                    },
                    {
                      type: "Mixed",
                      count: interviews.filter((i) =>
                        i.type?.toLowerCase().includes("hybrid")
                      ).length,
                      color: "red",
                    },
                  ].map(({ type, count, color }) => {
                    const percentage =
                      stats.totalInterviews > 0
                        ? ((count / stats.totalInterviews) * 100).toFixed(0)
                        : 0;
                    return (
                      <div
                        key={type}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-slate-600">{type}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-slate-200 rounded-full h-2">
                            <div
                              className={`bg-${color}-500 h-2 rounded-full`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div
                className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-white/20"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-slate-800">
                    Recent Activity
                  </h3>
                </div>
                <div className="space-y-3">
                  {interviews.slice(0, 3).map((interview, index) => (
                    <div
                      key={interview._id}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={`w-2 h-2 ${
                          interview.isComplete
                            ? "bg-green-500"
                            : "bg-orange-500"
                        } rounded-full`}
                      ></div>
                      <span className="text-sm text-slate-600">
                        {interview.userName}{" "}
                        {interview.isComplete ? "completed" : "started"} an
                        interview
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(interview.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-white/20"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-slate-800">
                    Coaching Requests
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-700">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-100">
                      <tr>
                        <th scope="col" className="px-4 py-3">
                          Full Name
                        </th>

                        <th scope="col" className="px-4 py-3 text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>{coachingRequests}</tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <UsersManagement
            users={users}
            handleDelete={handleDelete}
            onRefresh={fetchData}
          />
        )}

        {/* Coaches Tab */}
        {activeTab === "coaches" && (
          <CoachesManagement
            coaches={coaches}
            handleDelete={handleDelete}
            onRefresh={fetchData}
          />
        )}

        {/* Interviews Tab */}
        {activeTab === "interviews" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search interviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>

            {interviews.map((interview, index) => (
              <motion.div
                key={interview._id}
                className="bg-white/80 backdrop-blur-xl shadow-lg rounded-xl p-6 border border-white/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-full ${
                        interview.isComplete ? "bg-green-100" : "bg-orange-100"
                      }`}
                    >
                      {interview.isComplete ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Clock className="w-6 h-6 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        {interview.userName}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {interview.type} Interview • Coach:{" "}
                        {interview.coachName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            interview.isComplete
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {interview.isComplete ? "Completed" : "In Progress"}
                        </span>
                        {interview.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-slate-600">
                              {interview.rating}/5
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 mb-1">
                      Started:{" "}
                      {new Date(interview.createdAt).toLocaleDateString()}
                    </p>
                    {interview.completedAt && (
                      <p className="text-sm text-slate-600 mb-1">
                        Completed:{" "}
                        {new Date(interview.completedAt).toLocaleDateString()}
                      </p>
                    )}
                    {interview.duration && (
                      <p className="text-sm text-slate-600 mb-3">
                        Duration: {interview.duration} min
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Link
                        to={"/chat/session/" + interview._id}
                        className="p-2 text-slate-600 hover:text-indigo-600 transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
