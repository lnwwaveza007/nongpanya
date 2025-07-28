import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  HeartPulse,
  Eye,
  LayoutDashboard,
  Info,
  AlertTriangle,
  Pill,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageToggle from "@/components/ui/language-toggle";
import { getUserQuota, getUserHistory } from "@/api";
import { getAllMedicines } from "@/api/med";
import { signOut } from "@/api/auth";
import { UserLog } from "@/types";
import { Medicine } from "@/types/medicine";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import UserLogDetailModal from "@/components/form/UserLogDetailModal";
import MedicineDetailModal from "@/components/form/MedicineDetailModal";

const Homepage = () => {
  const { t } = useTranslation();
  const { user, hasMinimumRole } = useAuth();
  const navigate = useNavigate();

  const [quota, setQuota] = useState({ used: 0, maxPerMonth: 3 });
  const [userLogs, setUserLogs] = useState<UserLog[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedLog, setSelectedLog] = useState<UserLog | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [isMedicineModalOpen, setIsMedicineModalOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch quota
      const quotaResponse = await getUserQuota();
      if (quotaResponse.data.success) {
        setQuota({
          used: quotaResponse.data.data,
          maxPerMonth: 3,
        });
      }

      // Fetch user history
      const historyResponse = await getUserHistory();
      if (historyResponse.data.success) {
        // Sort by date and take latest 5
        const sortedLogs = historyResponse.data.data
          .sort(
            (a: UserLog, b: UserLog) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 5);
        setUserLogs(sortedLogs);
      }

      // Fetch available medicines
      const medicinesResponse = await getAllMedicines();
      if (medicinesResponse.data.success) {
        setMedicines(medicinesResponse.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      // Call the signout API endpoint
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    } finally {
      // Always clear local storage and redirect, even if API call fails
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      // Clear any cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      window.location.href = "/";
    }
  };

  const handleViewDetail = (log: UserLog) => {
    setSelectedLog(log);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedLog(null);
  };

  const handleMedicineClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsMedicineModalOpen(true);
  };

  const handleCloseMedicineModal = () => {
    setIsMedicineModalOpen(false);
    setSelectedMedicine(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const resetDate = new Date(
    new Date().setMonth(new Date().getMonth() + 1, 1)
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Language Toggle */}
      <LanguageToggle variant="floating" />

      <div className="max-w-6xl mx-auto mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Card */}
        <div className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-xl shadow-lg p-6 border-2 border-[#FF4B28] gap-4 h-full">
            <div className="flex items-center gap-4">
              <div
                className="text-4xl transition-all duration-300 hover:scale-110 cursor-pointer"
                style={{ color: "#FF4B28" }}
              >
                (✧ω✧)
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#FF4B28]">
                  {t("welcome.title")}
                </h1>
                <p className="text-gray-600">{user?.fullname || user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Dashboard Button for Admin */}
              {hasMinimumRole('admin') && (
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  className="flex items-center gap-2 border-[#FF4B28] text-[#FF4B28] hover:bg-[#FF4B28] hover:text-white w-full sm:w-auto"
                >
                  <LayoutDashboard size={20} />
                  <span className="hidden sm:inline">{t("homepage.dashboard")}</span>
                  <span className="sm:hidden">{t("homepage.dashboard")}</span>
                </Button>
              )}

              {/* Sign Out Button */}
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="flex items-center gap-2 border-[#FF4B28] text-[#FF4B28] hover:bg-[#FF4B28] hover:text-white w-full sm:w-auto"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">{t("homepage.signOut")}</span>
                <span className="sm:hidden">{t("homepage.signOut")}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Quota Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#FF4B28] h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#FF4B28]">
                {t("result.monthlyQuota")}
              </h2>
              <HeartPulse className="text-[#FF4B28]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-[#F5F7F9] rounded-lg">
                <p className="text-sm text-gray-600">{t("result.used")}</p>
                <p className="text-2xl font-bold text-[#FF4B28]">
                  {quota.used}/{quota.maxPerMonth}
                </p>
              </div>
              <div className="text-center p-3 bg-[#F5F7F9] rounded-lg">
                <p className="text-sm text-gray-600">{t("result.remaining")}</p>
                <p className="text-2xl font-bold text-[#FFC926]">
                  {quota.maxPerMonth - quota.used}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>
                {t("result.resetsOn")} {resetDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Available Medicines Section */}
        <Card className="border-[#FF4B28] shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#FF4B28] to-[#FF6B48] text-white">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="bg-white/20 p-2 rounded-lg">
                <Pill size={20} />
              </div>
              {t("homepage.availableMedicines.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {medicines.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Pill size={28} className="text-gray-400" />
                </div>
                <p className="text-gray-500">{t("homepage.availableMedicines.noMedicines")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {medicines.map((medicine) => (
                  <div
                    key={medicine.id}
                    onClick={() => handleMedicineClick(medicine)}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:border-[#FF4B28]/50 group"
                  >
                    <div className="text-center mb-3">
                      {medicine.image_url ? (
                        <img
                          src={medicine.image_url}
                          alt={medicine.name}
                          className="w-16 h-16 mx-auto rounded-lg object-cover border border-gray-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iI0Y5RkFGQiIvPgo8cGF0aCBkPSJNMzIgMjBIMzZWMjhIMjhWMjBIMzJaIiBmaWxsPSIjRjU5RTBCIi8+CjxwYXRoIGQ9Ik0yOCAzNkg0NFYyOEgyOFYzNloiIGZpbGw9IiNGNTlFMEIiLz4KPC9zdmc+';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 mx-auto rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center border border-orange-300">
                          <Pill size={24} className="text-orange-600" />
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
                        {medicine.name}
                      </h3>
                      
                      {medicine.description && (
                        <p className="text-xs text-gray-600 line-clamp-3 mb-3">
                          {medicine.description}
                        </p>
                      )}
                      
                      <div className="bg-gradient-to-r from-[#FF4B28]/10 to-[#FF6B48]/10 rounded-lg p-2">
                        <span className="text-xs font-medium text-[#FF4B28]">
                          {t("homepage.availableMedicines.available")}
                        </span>
                      </div>
                      
                      <div className="mt-2 text-center">
                        <span className="text-xs text-gray-400 group-hover:text-[#FF4B28] transition-colors">
                          {t("homepage.availableMedicines.clickForDetails")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Medicine Safety Guidelines */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 p-3 rounded-lg flex-shrink-0">
                  <Info size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">
                    {t("homepage.availableMedicines.guidelines.title")}
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                      {t("homepage.availableMedicines.guidelines.point1")}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                      {t("homepage.availableMedicines.guidelines.point2")}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                      {t("homepage.availableMedicines.guidelines.point3")}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                      {t("homepage.availableMedicines.guidelines.point4")}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="mt-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={24} className="text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">
                    {t("homepage.availableMedicines.notice.title")}
                  </h4>
                  <p className="text-sm text-red-700">
                    {t("homepage.availableMedicines.notice.description")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent History */}
        <Card className="border-[#FF4B28] shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#FF4B28] to-[#FF6B48] text-white">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="bg-white/20 p-2 rounded-lg">
                <Clock size={20} />
              </div>
              {t("homepage.recentHistory")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {userLogs.length === 0 ? (
              <div className="p-12 text-center">
                <div className="bg-gray-100 rounded-full p-8 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <Clock size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium mb-2">{t("homepage.noHistory")}</p>
                <p className="text-gray-400 text-sm">Your request history will appear here</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-orange-50 to-pink-50 border-b-2 border-[#FF4B28]/20">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          {t("homepage.code")}
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          {t("homepage.symptoms")}
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          {t("homepage.medicines")}
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          {t("homepage.status")}
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          {t("homepage.date")}
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          {t("homepage.actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {userLogs.map((log, index) => (
                        <tr
                          key={log.code}
                          className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-orange-25 hover:to-pink-25 transition-all duration-200 ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                          }`}
                        >
                          <td className="px-6 py-4">
                            <span className="font-mono font-semibold text-[#FF4B28] bg-[#FF4B28]/10 px-3 py-1 rounded-lg text-sm">
                              {log.code}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              {log.symptoms.slice(0, 2).map((symptom) => (
                                <span
                                  key={symptom.id}
                                  className="px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 rounded-full text-xs font-medium shadow-sm"
                                >
                                  {symptom.name}
                                </span>
                              ))}
                              {log.symptoms.length > 2 && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                  +{log.symptoms.length - 2} more
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              {log.medicines.slice(0, 2).map((medicine) => (
                                <span
                                  key={medicine.id}
                                  className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-xs font-medium shadow-sm"
                                >
                                  {medicine.name}
                                </span>
                              ))}
                              {log.medicines.length > 2 && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                  +{log.medicines.length - 2} more
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 w-fit shadow-sm ${
                                log.status === "completed"
                                  ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                                  : "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800"
                              }`}
                            >
                              {log.status === "completed" ? (
                                <CheckCircle2 size={14} />
                              ) : (
                                <AlertCircle size={14} />
                              )}
                              {log.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 text-sm">
                            {formatDate(log.created_at)}
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              onClick={() => handleViewDetail(log)}
                              size="sm"
                              variant="outline"
                              className="border-[#FF4B28] text-[#FF4B28] hover:bg-[#FF4B28] hover:text-white transition-all duration-200 shadow-sm"
                            >
                              <Eye size={16} className="mr-1" />
                              {t("homepage.view")}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4 p-4">
                  {userLogs.map((log) => (
                    <div
                      key={log.code}
                      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-mono font-semibold text-[#FF4B28] bg-[#FF4B28]/10 px-3 py-1 rounded-lg text-sm">
                          {log.code}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm ${
                            log.status === "completed"
                              ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                              : "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800"
                          }`}
                        >
                          {log.status === "completed" ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <AlertCircle size={12} />
                          )}
                          {log.status}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Symptoms</p>
                          <div className="flex flex-wrap gap-1">
                            {log.symptoms.slice(0, 3).map((symptom) => (
                              <span
                                key={symptom.id}
                                className="px-2 py-1 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 rounded-full text-xs"
                              >
                                {symptom.name}
                              </span>
                            ))}
                            {log.symptoms.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                +{log.symptoms.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Medicines</p>
                          <div className="flex flex-wrap gap-1">
                            {log.medicines.slice(0, 3).map((medicine) => (
                              <span
                                key={medicine.id}
                                className="px-2 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-xs"
                              >
                                {medicine.name}
                              </span>
                            ))}
                            {log.medicines.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                +{log.medicines.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          {formatDate(log.created_at)}
                        </span>
                        <Button
                          onClick={() => handleViewDetail(log)}
                          size="sm"
                          variant="outline"
                          className="border-[#FF4B28] text-[#FF4B28] hover:bg-[#FF4B28] hover:text-white"
                        >
                          <Eye size={14} className="mr-1" />
                          {t("homepage.view")}
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

      {/* Medicine Detail Modal */}
      <MedicineDetailModal
        isOpen={isMedicineModalOpen}
        onClose={handleCloseMedicineModal}
        medicine={selectedMedicine}
      />
    </div>
  );
};

export default Homepage;
