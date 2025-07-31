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
import MedicineImage from "@/components/ui/medicine-image";
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
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null
  );
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
      try {
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
      } catch (error) {
        // Failed to fetch user history
        // Keep userLogs as empty array (default state)
      }

      // Fetch available medicines with stock information
      const medicinesResponse = await getAllMedicines();
      if (medicinesResponse.data.success) {
        setMedicines(medicinesResponse.data.data);
      }
    } catch (error) {
      // Failed to fetch user data
    }
  };

  const handleSignOut = async () => {
    try {
      // Call the signout API endpoint
      await signOut();
    } catch (error) {
      // Failed to sign out
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
    <div className="min-h-screen bg-gray-50 p-3">
      {/* Language Toggle */}
      <LanguageToggle variant="floating" />

      <div className="max-w-6xl mx-auto mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Welcome Card */}
        <div className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-lg shadow-md p-4 border-2 border-[#FF4B28] gap-3 h-full">
            <div className="flex items-center gap-3">
              <div
                className="text-3xl transition-all duration-300 hover:scale-110 cursor-pointer"
                style={{ color: "#FF4B28" }}
              >
                (✧ω✧)
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#FF4B28]">
                  {t("welcome.title")}
                </h1>
                <p className="text-gray-600 text-sm">{user?.fullname || user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Dashboard Button for Admin */}
              {hasMinimumRole("admin") && (
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 border-2 border-[#FF4B28] text-[#FF4B28] hover:bg-[#FF4B28] hover:text-white w-full sm:w-auto text-xs"
                >
                  <LayoutDashboard size={16} />
                  <span className="hidden sm:inline">
                    {t("homepage.dashboard")}
                  </span>
                  <span className="sm:hidden">{t("homepage.dashboard")}</span>
                </Button>
              )}

              {/* Sign Out Button */}
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 border-2 border-[#FF4B28] text-[#FF4B28] hover:bg-[#FF4B28] hover:text-white w-full sm:w-auto text-xs"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">
                  {t("homepage.signOut")}
                </span>
                <span className="sm:hidden">{t("homepage.signOut")}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Quota Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 border-2 border-[#FF4B28] h-full">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-[#FF4B28]">
                {t("result.monthlyQuota")}
              </h2>
              <HeartPulse className="text-[#FF4B28]" size={20} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-[#F5F7F9] rounded-lg">
                <p className="text-xs text-gray-600">{t("result.used")}</p>
                <p className="text-xl font-bold text-[#FF4B28]">
                  {quota.used}/{quota.maxPerMonth}
                </p>
              </div>
              <div className="text-center p-2 bg-[#F5F7F9] rounded-lg">
                <p className="text-xs text-gray-600">{t("result.remaining")}</p>
                <p className="text-xl font-bold text-[#FFC926]">
                  {quota.maxPerMonth - quota.used}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-gray-600">
              <Calendar className="w-3 h-3 mr-1" />
              <span>
                {t("result.resetsOn")} {resetDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Available Medicines Section */}
        <Card className="border-2 border-[#FF4B28] shadow-lg overflow-hidden">
          <CardHeader className="bg-[#FF4B28] text-white py-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Pill size={16} />
              </div>
              {t("homepage.availableMedicines.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {medicines.length === 0 ? (
              <div className="text-center py-6">
                <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Pill size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">
                  {t("homepage.availableMedicines.noMedicines")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {medicines.map((medicine) => (
                  <div
                    key={medicine.id}
                    onClick={() => handleMedicineClick(medicine)}
                    className={`bg-white border-2 rounded-lg p-3 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group ${
                      medicine.total_stock === 0
                        ? "border-red-200 opacity-75 hover:border-red-300"
                        : "border-gray-200 hover:border-[#FF4B28]/50"
                    }`}
                  >
                    <div className="text-center mb-2">
                      <div className="flex justify-center">
                        <MedicineImage
                          medicine={medicine}
                          size="md"
                          showGrayscale={true}
                        />
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="font-semibold text-gray-800 text-xs mb-1 line-clamp-2">
                        {medicine.name}
                      </h3>

                      {medicine.description && (
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                          {t(`medicineDescription.${medicine.id}`)}
                        </p>
                      )}

                      <div
                        className={`rounded-lg p-1.5 ${
                          medicine.total_stock === 0
                            ? "bg-red-100"
                            : "bg-green-100"
                        }`}
                      >
                        <span
                          className={`text-xs font-medium ${
                            medicine.total_stock === 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {medicine.total_stock === 0
                            ? t("homepage.availableMedicines.outOfStock")
                            : `${t("homepage.availableMedicines.available")}`}
                        </span>
                      </div>

                      <div className="mt-1 text-center">
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
            <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info size={20} className="text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2 text-sm">
                    {t("homepage.availableMedicines.guidelines.title")}
                  </h4>
                  <ul className="space-y-1 text-xs text-blue-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5 flex-shrink-0">
                        •
                      </span>
                      {t("homepage.availableMedicines.guidelines.point1")}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5 flex-shrink-0">
                        •
                      </span>
                      {t("homepage.availableMedicines.guidelines.point2")}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5 flex-shrink-0">
                        •
                      </span>
                      {t("homepage.availableMedicines.guidelines.point3")}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5 flex-shrink-0">
                        •
                      </span>
                      {t("homepage.availableMedicines.guidelines.point4")}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle
                  size={20}
                  className="text-red-500 mt-0.5 flex-shrink-0"
                />
                <div>
                  <h4 className="font-semibold text-red-800 mb-1 text-sm">
                    {t("homepage.availableMedicines.notice.title")}
                  </h4>
                  <p className="text-xs text-red-700">
                    {t("homepage.availableMedicines.notice.description")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent History */}
        <Card className="border-2 border-[#FF4B28] shadow-lg overflow-hidden">
          <CardHeader className="bg-[#FF4B28] text-white py-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Clock size={16} />
              </div>
              {t("homepage.recentHistory")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {userLogs.length === 0 ? (
              <div className="p-8 text-center">
                <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-3 flex items-center justify-center">
                  <Clock size={28} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-base font-medium mb-1">
                  {t("homepage.noHistory")}
                </p>
                <p className="text-gray-400 text-xs">
                  Your request history will appear here
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-orange-50 border-b-2 border-[#FF4B28]/20">
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                          {t("homepage.code")}
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                          {t("homepage.symptoms")}
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                          {t("homepage.medicines")}
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                          {t("homepage.status")}
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                          {t("homepage.date")}
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                          {t("homepage.actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {userLogs.map((log, index) => (
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
                            <div className="flex flex-wrap gap-1">
                              {log.symptoms.slice(0, 2).map((symptom) => (
                                <span
                                  key={symptom.id}
                                  className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full text-xs font-medium"
                                >
                                  {symptom.name}
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
                              {log.medicines.slice(0, 2).map((medicine) => (
                                <span
                                  key={medicine.id}
                                  className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                                >
                                  {medicine.name}
                                </span>
                              ))}
                              {log.medicines.length > 2 && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                  +{log.medicines.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                                log.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {log.status === "completed" ? (
                                <CheckCircle2 size={12} />
                              ) : (
                                <AlertCircle size={12} />
                              )}
                              {log.status}
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
                              {t("homepage.view")}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-3 p-2">
                  {userLogs.map((log) => (
                    <div
                      key={log.code}
                      className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono font-semibold text-[#FF4B28] bg-[#FF4B28]/10 px-2 py-1 rounded-lg text-xs">
                          {log.code}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                            log.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {log.status === "completed" ? (
                            <CheckCircle2 size={10} />
                          ) : (
                            <AlertCircle size={10} />
                          )}
                          {log.status}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">
                            Symptoms
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {log.symptoms.slice(0, 3).map((symptom) => (
                              <span
                                key={symptom.id}
                                className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full text-xs"
                              >
                                {symptom.name}
                              </span>
                            ))}
                            {log.symptoms.length > 3 && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                +{log.symptoms.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">
                            Medicines
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {log.medicines.slice(0, 3).map((medicine) => (
                              <span
                                key={medicine.id}
                                className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs"
                              >
                                {medicine.name}
                              </span>
                            ))}
                            {log.medicines.length > 3 && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                +{log.medicines.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          {formatDate(log.created_at)}
                        </span>
                        <Button
                          onClick={() => handleViewDetail(log)}
                          size="sm"
                          variant="outline"
                          className="border border-[#FF4B28] text-[#FF4B28] hover:bg-[#FF4B28] hover:text-white h-7 px-2 text-xs"
                        >
                          <Eye size={12} className="mr-1" />
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
