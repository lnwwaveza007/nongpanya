import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Search, Filter, Clock, CheckCircle2, AlertCircle, Eye, Calendar, Users, User, XCircle } from "lucide-react";
import UserLogDetailModal from "../components/form/UserLogDetailModal";
import Header from "../components/layout/Header";
import { UserLog } from "@/types";
import { getUserLogs } from "@/api";
import LanguageToggle from "@/components/ui/language-toggle";
import { useTranslation } from "react-i18next";

const UserLogPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedLog, setSelectedLog] = useState<UserLog | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [userLogs, setUserLogs] = useState<UserLog[]>([]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string, size: number = 12) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={size} />;
      case "pending":
        return <AlertCircle size={size} />;
      case "failed":
        return <XCircle size={size} />;
      default:
        return <AlertCircle size={size} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return t('userLog.completed');
      case "pending":
        return t('userLog.pending');
      case "failed":
        return t('userLog.failed');
      default:
        return status;
    }
  };

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

  const getUserLogsAPI = useCallback(async () => {
    const response = await getUserLogs(startDate, endDate);
    const data = response.data.data;
    setUserLogs(data);
  }, [startDate, endDate]);

  useEffect(() => {
    if (startDate || endDate) {
      getUserLogsAPI();
    }
  }, [startDate, endDate, getUserLogsAPI]);

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
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-md p-4 border-2 border-[#FF4B28] mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#FF4B28]/10 p-2 rounded-lg">
              <Users size={24} className="text-[#FF4B28]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#FF4B28]">{t('userLog.title')}</h1>
              <p className="text-gray-600 text-sm">{t('userLog.subtitle')}</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-2 border-blue-200 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-600">{t('userLog.totalLogs')}</p>
                  <p className="text-xl font-bold text-blue-700">{filteredLogs.length}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users size={20} className="text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-green-600">{t('userLog.completed')}</p>
                  <p className="text-xl font-bold text-green-700">
                    {filteredLogs.filter(log => log.status === "completed").length}
                  </p>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle2 size={20} className="text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-200 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-yellow-600">{t('userLog.pending')}</p>
                  <p className="text-xl font-bold text-yellow-700">
                    {filteredLogs.filter(log => log.status === "pending").length}
                  </p>
                </div>
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <AlertCircle size={20} className="text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-red-600">{t('userLog.failed')}</p>
                  <p className="text-xl font-bold text-red-700">
                    {filteredLogs.filter(log => log.status === "failed").length}
                  </p>
                </div>
                <div className="bg-red-100 p-2 rounded-lg">
                  <XCircle size={20} className="text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-purple-600">{t('userLog.thisWeek')}</p>
                  <p className="text-xl font-bold text-purple-700">
                    {filteredLogs.filter(log => {
                      const logDate = new Date(log.created_at);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return logDate >= weekAgo;
                    }).length}
                  </p>
                </div>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Calendar size={20} className="text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-2 border-[#FF4B28] shadow-lg overflow-hidden mb-6">
          <CardHeader className="bg-[#FF4B28] text-white py-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Filter size={16} />
              </div>
              {t('userLog.filtersAndSearch')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Search and Status Filters */}
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder={t('userLog.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4B28] focus:border-[#FF4B28] bg-white text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    onClick={() => setStatusFilter("all")}
                    size="sm"
                    className={`flex items-center gap-1 text-xs ${
                      statusFilter === "all" 
                        ? "bg-[#FF4B28] hover:bg-[#FF4B28]/90 text-white border-[#FF4B28]" 
                        : "border-2 border-[#FF4B28] text-[#FF4B28] hover:bg-[#FF4B28] hover:text-white"
                    }`}
                  >
                    <Filter size={16} />
                    {t('userLog.all')}
                  </Button>
                  <Button
                    variant={statusFilter === "completed" ? "default" : "outline"}
                    onClick={() => setStatusFilter("completed")}
                    size="sm"
                    className={`flex items-center gap-1 text-xs ${
                      statusFilter === "completed" 
                        ? "bg-green-600 hover:bg-green-700 text-white border-green-600" 
                        : "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                    }`}
                  >
                    <CheckCircle2 size={12} />
                    {t('userLog.completed')}
                  </Button>
                  <Button
                    variant={statusFilter === "pending" ? "default" : "outline"}
                    onClick={() => setStatusFilter("pending")}
                    size="sm"
                    className={`flex items-center gap-1 text-xs ${
                      statusFilter === "pending" 
                        ? "bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600" 
                        : "border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white"
                    }`}
                  >
                    <AlertCircle size={12} />
                    {t('userLog.pending')}
                  </Button>
                  <Button
                    variant={statusFilter === "failed" ? "default" : "outline"}
                    onClick={() => setStatusFilter("failed")}
                    size="sm"
                    className={`flex items-center gap-1 text-xs ${
                      statusFilter === "failed" 
                        ? "bg-red-600 hover:bg-red-700 text-white border-red-600" 
                        : "border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    }`}
                  >
                    <XCircle size={12} />
                    {t('userLog.failed')}
                  </Button>
                </div>
              </div>
              
              {/* Date Range Filters */}
              <div className="flex flex-col md:flex-row gap-3 items-center">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-500" />
                  <span className="text-xs font-medium text-gray-700">{t('userLog.dateRange')}:</span>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border-2 border-[#FF4B28] rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-[#FF4B28]/50 focus:border-[#FF4B28] bg-[#FF4B28] text-white"
                    placeholder="Start Date"
                  />
                  <span className="text-gray-500 font-medium text-xs">{t('userLog.to')}</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border-2 border-[#FF4B28] rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-[#FF4B28]/50 focus:border-[#FF4B28] bg-[#FF4B28] text-white"
                    placeholder="End Date"
                  />
                </div>
                {(startDate || endDate) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                    }}
                    className="border-2 border-red-300 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                  >
                    {t('userLog.clearDates')}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card className="border-2 border-[#FF4B28] shadow-lg overflow-hidden">
          <CardHeader className="bg-[#FF4B28] text-white py-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Clock size={16} />
              </div>
              {t('userLog.userActivityLogs')} ({filteredLogs.length} {t('userLog.results')})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center">
                <div className="bg-gray-100 rounded-full p-8 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <User size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium mb-2">{t('userLog.noLogsFound')}</p>
                <p className="text-gray-400 text-sm">{t('userLog.noLogsMessage')}</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-orange-50 border-b-2 border-[#FF4B28]/20">
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">{t('userLog.code')}</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">{t('userLog.user')}</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">{t('userLog.symptoms')}</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">{t('userLog.medicines')}</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">{t('userLog.notes')}</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">{t('userLog.status')}</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">{t('userLog.date')}</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">{t('userLog.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.map((log, index) => (
                        <tr
                          key={log.code}
                          className={`border-b border-gray-100 hover:bg-orange-50 transition-all duration-200 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                          }`}
                        >
                          <td className="px-4 py-3">
                            <span className="font-mono font-semibold text-[#FF4B28] bg-[#FF4B28]/10 px-2 py-1 rounded-lg text-xs">
                              {log.code}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="bg-[#FF4B28]/10 p-1.5 rounded-full">
                                <User size={14} className="text-[#FF4B28]" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 text-xs">{log.fullname}</div>
                                <div className="text-xs text-gray-500">{log.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {log.symptoms.slice(0, 2).map((symptom, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full text-xs font-medium"
                                >
                                  {typeof symptom === 'string' ? symptom : symptom.name || t('userLog.unknown')}
                                </span>
                              ))}
                              {log.symptoms.length > 2 && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                  +{log.symptoms.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {log.medicines.slice(0, 2).map((med, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                                >
                                  {typeof med === 'string' ? med : med.name || t('userLog.unknown')}
                                </span>
                              ))}
                              {log.medicines.length > 2 && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                  +{log.medicines.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 max-w-xs">
                            <div className="text-gray-600 truncate text-xs">
                              {(log as UserLog & { note?: string }).note || t('userLog.noNotes')}
                            </div>
                            {log.allergies && (
                              <div className="text-xs text-red-600 mt-0.5">
                                {t('userLog.allergies')}: {log.allergies}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${getStatusStyle(log.status)}`}
                            >
                              {getStatusIcon(log.status)}
                              {getStatusText(log.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-xs">
                            {formatDate(log.created_at)}
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              onClick={() => handleViewDetail(log)}
                              size="sm"
                              variant="outline"
                              className="border-2 border-[#FF4B28] text-[#FF4B28] hover:bg-[#FF4B28] hover:text-white transition-all duration-200 shadow-sm h-7 px-2 text-xs"
                            >
                              <Eye size={12} className="mr-1" />
                              {t('userLog.view')}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-3 p-3">
                  {filteredLogs.map((log) => (
                    <div
                      key={log.code}
                      className="bg-white border-2 border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono font-semibold text-[#FF4B28] bg-[#FF4B28]/10 px-2 py-1 rounded-lg text-xs">
                          {log.code}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusStyle(log.status)}`}
                        >
                          {getStatusIcon(log.status, 10)}
                          {getStatusText(log.status)}
                        </span>
                      </div>

                      <div className="mb-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-[#FF4B28]/10 p-1.5 rounded-full">
                            <User size={14} className="text-[#FF4B28]" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{log.fullname}</div>
                            <div className="text-xs text-gray-500">{log.email}</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">{t('userLog.symptoms')}</p>
                          <div className="flex flex-wrap gap-1">
                            {log.symptoms.slice(0, 3).map((symptom, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded-full text-xs"
                              >
                                {typeof symptom === 'string' ? symptom : symptom.name || t('userLog.unknown')}
                              </span>
                            ))}
                            {log.symptoms.length > 3 && (
                              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                +{log.symptoms.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">{t('userLog.medicines')}</p>
                          <div className="flex flex-wrap gap-1">
                            {log.medicines.slice(0, 3).map((medicine, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs"
                              >
                                {typeof medicine === 'string' ? medicine : medicine.name || t('userLog.unknown')}
                              </span>
                            ))}
                            {log.medicines.length > 3 && (
                              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                +{log.medicines.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        {((log as UserLog & { note?: string }).note || log.allergies) && (
                                                  <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">{t('userLog.notes')}</p>
                            <div className="text-xs text-gray-600">
                                                              {(log as UserLog & { note?: string }).note || t('userLog.noNotes')}
                                {log.allergies && (
                                  <div className="text-xs text-red-600 mt-0.5">
                                    {t('userLog.allergies')}: {log.allergies}
                                  </div>
                                )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          {formatDate(log.created_at)}
                        </span>
                        <Button
                          onClick={() => handleViewDetail(log)}
                          size="sm"
                          variant="outline"
                          className="border-2 border-[#FF4B28] text-[#FF4B28] hover:bg-[#FF4B28] hover:text-white h-7 px-2 text-xs"
                        >
                          <Eye size={12} className="mr-1" />
                          {t('userLog.view')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
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
