import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Search, Filter, Clock, CheckCircle2, AlertCircle, Eye, Calendar } from "lucide-react";
import UserLogDetailModal from "../components/form/UserLogDetailModal";
import Header from "../components/layout/Header";
import { UserLog } from "@/types";
import { getUserLogs } from "@/api";

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
    <div className="min-h-screen w-full bg-white max-w-none">
      <Header activePage="user-log" />

      {/* Title */}
      <div className="px-8 py-4 flex items-center gap-2">
        <span className="text-2xl font-semibold text-gray-800">
          <i className="fa-solid fa-users mr-2" style={{ color: 'rgb(249 115 22)' }} />
          User Logs
        </span>
      </div>

      {/* Filters */}
      <div className="px-8 mb-6">
        <Card className="border-orange-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              {/* Search and Status Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search by name, email, or code..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    onClick={() => setStatusFilter("all")}
                    className="flex items-center gap-2"
                    style={statusFilter === "all" ? { backgroundColor: 'rgb(249 115 22)', borderColor: 'rgb(249 115 22)' } : {}}
                  >
                    <Filter size={16} />
                    All
                  </Button>
                  <Button
                    variant={statusFilter === "completed" ? "default" : "outline"}
                    onClick={() => setStatusFilter("completed")}
                    className="flex items-center gap-2"
                    style={statusFilter === "completed" ? { backgroundColor: 'rgb(249 115 22)', borderColor: 'rgb(249 115 22)' } : {}}
                  >
                    <CheckCircle2 size={16} />
                    Completed
                  </Button>
                  <Button
                    variant={statusFilter === "pending" ? "default" : "outline"}
                    onClick={() => setStatusFilter("pending")}
                    className="flex items-center gap-2"
                    style={statusFilter === "pending" ? { backgroundColor: 'rgb(249 115 22)', borderColor: 'rgb(249 115 22)' } : {}}
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
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-orange-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-orange-500 text-white"
                    placeholder="Start Date"
                  />
                  <span className="text-gray-500 self-center">to</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-orange-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-orange-500 text-white"
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
                    className="text-red-600 hover:text-red-700 border-red-300"
                  >
                    Clear Dates
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs Table */}
      <div className="px-8">
        <Card className="border-orange-200 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-orange-200 bg-orange-50">
                    <th className="px-4 py-3 text-left text-gray-700">Code</th>
                    <th className="px-4 py-3 text-left text-gray-700">User</th>
                    <th className="px-4 py-3 text-left text-gray-700">Symptoms</th>
                    <th className="px-4 py-3 text-left text-gray-700">Medicines</th>
                    <th className="px-4 py-3 text-left text-gray-700">Notes</th>
                    <th className="px-4 py-3 text-left text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.code} className="border-b border-orange-100 hover:bg-orange-50">
                      <td className="px-4 py-3 font-medium">{log.code}</td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium">{log.fullname}</div>
                          <div className="text-gray-500 text-xs">{log.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {log.symptoms.map((symptom) => (
                            <span
                              key={symptom.id}
                              className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs"
                              style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', color: 'rgb(249 115 22)' }}
                            >
                              {symptom.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {log.medicines.map((medicine) => (
                            <span
                              key={medicine.id}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                            >
                              {medicine.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <div className="text-gray-600 truncate">{log.additional_notes}</div>
                        {log.allergies && (
                          <div className="text-xs text-red-500 mt-1">
                            Allergies: {log.allergies}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            log.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {formatDate(log.created_at)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleViewDetail(log)}
                          className="text-orange-600 hover:text-orange-700 flex items-center gap-1 bg-white border border-orange-200 rounded-md px-2 py-1"
                          style={{ color: 'rgb(249 115 22)' }}
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
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