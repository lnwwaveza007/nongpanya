import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Search, Filter, Clock, CheckCircle2, AlertCircle, Eye, Calendar, Users, User } from "lucide-react";
import UserLogDetailModal from "../components/form/UserLogDetailModal";
import Header from "../components/layout/Header";
import { UserLog } from "@/types";
import { getUserLogs } from "@/api";
import LanguageToggle from "@/components/ui/language-toggle";

const UserLogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedLog, setSelectedLog] = useState<UserLog | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [userLogs, setUserLogs] = useState<UserLog[]>([]);

  // Function to get current week's start and end dates
  const getCurrentWeekRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate start of week (Monday)
    const startOfWeek = new Date(today);
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday, go back 6 days to Monday
    startOfWeek.setDate(today.getDate() - daysToSubtract);
    
    // Calculate end of week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return {
      start: startOfWeek.toISOString().split('T')[0],
      end: endOfWeek.toISOString().split('T')[0]
    };
  };

  useEffect(() => {
    // Set current week as default date range
    const weekRange = getCurrentWeekRange();
    setStartDate(weekRange.start);
    setEndDate(weekRange.end);
  }, []);

  useEffect(() => {
    if (startDate || endDate) {
      getUserLogsAPI();
    }
  }, [startDate, endDate]);

  const getUserLogsAPI = async () => {
    const response = await getUserLogs(startDate, endDate);
    const data = response.data.data;
    setUserLogs(data);
  }

  const handleViewDetail = (log: UserLog) => {
    setSelectedLog(log);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedLog(null);
  };

  const filteredLogs = userLogs.filter(log => {
    const matchesSearch = 
      log.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.code.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activePage="user-log" />
      <LanguageToggle variant="floating" />

      {/* Title Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#FF4B28] mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-[#FF4B28]/10 p-3 rounded-lg">
              <Users size={32} className="text-[#FF4B28]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#FF4B28]">User Logs</h1>
              <p className="text-gray-600 mt-1">Monitor user activity and medicine dispensing history</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Logs</p>
                  <p className="text-2xl font-bold text-blue-700">{filteredLogs.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users size={24} className="text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Completed</p>
                  <p className="text-2xl font-bold text-green-700">
                    {filteredLogs.filter(log => log.status === "completed").length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle2 size={24} className="text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {filteredLogs.filter(log => log.status === "pending").length}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <AlertCircle size={24} className="text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">This Week</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {filteredLogs.filter(log => {
                      const logDate = new Date(log.created_at);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return logDate >= weekAgo;
                    }).length}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Calendar size={24} className="text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-2 border-[#FF4B28] shadow-xl overflow-hidden mb-8">
          <CardHeader className="bg-[#FF4B28] text-white">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="bg-white/20 p-2 rounded-lg">
                <Filter size={20} />
              </div>
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Search and Status Filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search by name, email, or code..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4B28] focus:border-[#FF4B28] bg-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    onClick={() => setStatusFilter("all")}
                    className={`flex items-center gap-2 ${
                      statusFilter === "all" 
                        ? "bg-[#FF4B28] hover:bg-[#FF4B28]/90 text-white border-[#FF4B28]" 
                        : "border-2 border-[#FF4B28] text-[#FF4B28] hover:bg-[#FF4B28] hover:text-white"
                    }`}
                  >
                    <Filter size={16} />
                    All
                  </Button>
                  <Button
                    variant={statusFilter === "completed" ? "default" : "outline"}
                    onClick={() => setStatusFilter("completed")}
                    className={`flex items-center gap-2 ${
                      statusFilter === "completed" 
                        ? "bg-green-600 hover:bg-green-700 text-white border-green-600" 
                        : "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                    }`}
                  >
                    <CheckCircle2 size={16} />
                    Completed
                  </Button>
                  <Button
                    variant={statusFilter === "pending" ? "default" : "outline"}
                    onClick={() => setStatusFilter("pending")}
                    className={`flex items-center gap-2 ${
                      statusFilter === "pending" 
                        ? "bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600" 
                        : "border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white"
                    }`}
                  >
                    <AlertCircle size={16} />
                    Pending
                  </Button>
                </div>
              </div>
              
              {/* Date Range Filters */}
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Date Range:</span>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border-2 border-[#FF4B28] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#FF4B28]/50 focus:border-[#FF4B28] bg-[#FF4B28] text-white"
                    placeholder="Start Date"
                  />
                  <span className="text-gray-500 font-medium">to</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border-2 border-[#FF4B28] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#FF4B28]/50 focus:border-[#FF4B28] bg-[#FF4B28] text-white"
                    placeholder="End Date"
                  />
                </div>
                {(startDate || endDate) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                    }}
                    className="border-2 border-red-300 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Clear Dates
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card className="border-2 border-[#FF4B28] shadow-xl overflow-hidden">
          <CardHeader className="bg-[#FF4B28] text-white">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="bg-white/20 p-2 rounded-lg">
                <Clock size={20} />
              </div>
              User Activity Logs ({filteredLogs.length} results)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-[#FF4B28]/20 bg-gray-50">
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">Code</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">User</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">Symptoms</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">Medicines</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">Notes</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-gray-700 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="bg-gray-100 rounded-full p-6 w-20 h-20 flex items-center justify-center">
                            <User size={32} className="text-gray-400" />
                          </div>
                          <div>
                            <p className="text-gray-500 text-lg font-medium">No logs found</p>
                            <p className="text-gray-400 text-sm">Try adjusting your search criteria or date range</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.code} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded font-medium">
                            {log.code}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-[#FF4B28]/10 p-2 rounded-full">
                              <User size={16} className="text-[#FF4B28]" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{log.fullname}</div>
                              <div className="text-sm text-gray-500">{log.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {log.symptoms.slice(0, 2).map((symptom, idx) => (
                              <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {typeof symptom === 'string' ? symptom : symptom.name || 'Unknown'}
                              </span>
                            ))}
                            {log.symptoms.length > 2 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                +{log.symptoms.length - 2} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {log.medicines.slice(0, 2).map((med, idx) => (
                              <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {typeof med === 'string' ? med : med.name || 'Unknown'}
                              </span>
                            ))}
                            {log.medicines.length > 2 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                +{log.medicines.length - 2} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <div className="text-gray-600 truncate">{log.additional_notes || "No notes"}</div>
                          {log.allergies && (
                            <div className="text-xs text-red-600 mt-1">
                              Allergies: {log.allergies}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              log.status === "completed"
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                            }`}
                          >
                            {log.status === "completed" ? "Completed" : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span className="text-sm">{formatDate(log.created_at)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(log)}
                            className="flex items-center gap-2 border-[#FF4B28] text-[#FF4B28] hover:bg-[#FF4B28] hover:text-white"
                          >
                            <Eye size={16} />
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <UserLogDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          log={selectedLog}
        />
      )}
    </div>
  );
};

export default UserLogPage;
