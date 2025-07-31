import { getUserQuota } from "@/api";
import { HeartPulse, AlertCircle, Calendar, Info, Home } from "lucide-react";
import {
  useState,
  useEffect,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageToggle from "@/components/ui/language-toggle";
import { Medical } from "@/types";

const ResultsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [used, setUsed] = useState(0);
  const prescribedMedications = useLocation().state?.data;

  useEffect(() => {
    const getUserQuotaAPI = async () => {
      const res = await getUserQuota();
      setUsed(res.data.data);
    }
    getUserQuotaAPI();
  }, []);

  const resetDate = new Date(
    new Date().setMonth(new Date().getMonth() + 1, 1)
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const studentQuota = {
    maxPerMonth: 3,
    used: used,
    resetDate: resetDate
  };

  // const mockupMedications = [
  //   {
  //     imageUrl: "https://hdmall.co.th/blog/wp-content/uploads/2024/07/paracetamol.jpg",
  //     name: "Medication 1",
  //     type: "Tablet",
  //     quantity: 1,
  //     frequency: 1,
  //     description: "This is a description of the medication",
  //     instructions: [15, 16, 17, 18, 19],
  //     warnings: [20, 21, 22, 23, 24, 25]
  //   },
  // ];

  return (
    <div className="min-h-screen p-8">
      <LanguageToggle variant="floating" />
      
      {/* Header with Robot */}
      <div className="text-center mb-8">
        <div className="text-6xl font-bold text-[#FF4B28] animate-bounce-slow">
          (｡^‿^｡)
        </div>
        <h1 className="text-4xl font-bold mt-4 text-[#FF4B28]">
          {t("result.title")}
        </h1>
        <p className="text-gray-600 mt-2">
          {t("result.subtitle")}
        </p>
      </div>

      {/* Quota Card */}
      <div className="max-w-md mx-auto mb-6 bg-white rounded-lg shadow-md p-4 border border-[#FF4B28]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#FF4B28]">{t("result.monthlyQuota")}</h2>
          <HeartPulse className="text-[#FF4B28]" size={18} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-[#F5F7F9] rounded-lg">
            <p className="text-xs text-gray-600">{t("result.used")}</p>
            <p className="text-xl font-bold text-[#FF4B28]">
              {studentQuota.used}/{studentQuota.maxPerMonth}
            </p>
          </div>
          <div className="text-center p-2 bg-[#F5F7F9] rounded-lg">
            <p className="text-xs text-gray-600">{t("result.remaining")}</p>
            <p className="text-xl font-bold text-[#FFC926]">
              {studentQuota.maxPerMonth - studentQuota.used}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center text-xs text-gray-600">
          <Calendar className="w-3 h-3 mr-1" />
          <span>{t("result.resetsOn")} {studentQuota.resetDate}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {(!prescribedMedications || prescribedMedications.length === 0) ? (
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-400 text-center">
            <div className="flex flex-col items-center space-y-2">
              <AlertCircle className="w-10 h-10 text-yellow-500" />
              <h3 className="text-base font-semibold text-gray-800">
                {t("result.noMedicines.title")}
              </h3>
              <p className="text-gray-600 max-w-md text-xs">
                {t("result.noMedicines.message")}
              </p>
              <ul className="text-xs text-gray-500 space-y-0.5 max-w-lg">
                <li>• {t("result.noMedicines.reasons.allergies")}</li>
                <li>• {t("result.noMedicines.reasons.outOfStock")}</li>
                <li>• {t("result.noMedicines.reasons.noMatch")}</li>
              </ul>
              <button
                onClick={() => navigate('/')}
                className="mt-2 bg-[#FF4B28] text-white px-3 py-1.5 rounded-lg hover:bg-[#E63E1E] transition-colors flex items-center gap-1 text-xs"
              >
                <Home className="w-3 h-3" />
                {t("result.noMedicines.backHome")}
              </button>
            </div>
          </div>
        ) : (
          prescribedMedications?.map((med : Medical, index: number) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-3 border-l-4 border-[#FF4B28]"
          >
            <div className="grid md:grid-cols-3 gap-3">
              {/* Image Section */}
              <div className="md:col-span-1">
                <div className="bg-[#F5F7F9] rounded-lg p-3 flex flex-col items-center">
                  <img
                    src={med.imageUrl}
                    alt={med.name}
                    className="rounded-lg shadow-sm"
                    // width={med.imageSize.width}
                    // height={med.imageSize.height}
                  />
                  <div className="mt-2 text-center">
                    <p className="text-xs text-gray-600">{med.type}</p>
                    <div className="flex items-center justify-center mt-1 text-xs text-gray-500">
                      <Info className="w-2 h-2 mr-1" />
                      <span>{t("result.representativeImage")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="md:col-span-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base text-left font-bold text-[#FF4B28]">
                      {med.name}
                    </h3>
                    <p className="text-gray-600 text-left text-sm">
                      {t("result.quantity")}: {med.quantity}
                    </p>
                  </div>
                  {/* <div className="bg-[#F5F7F9] px-4 py-2 rounded-lg">
                    <Clock className="inline-block mr-2" size={16} />
                    {med.frequency}
                  </div> */}
                </div>

                <div className="mt-3 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm">{t(`medicineDescription.${med.id}`)}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1 text-sm">{t("result.instructions")}</h4>
                    <ul className="space-y-1 text-left">
                      {med.instructions?.map((instruction, i) => (
                        <li key={i} className="flex items-center text-gray-600 text-xs">
                          <span className="w-1.5 h-1.5 bg-[#FFC926] rounded-full mr-2"></span>
                          {t(`detail.${instruction}`)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-start mb-1">
                      <AlertCircle className="text-red-500 mr-2" size={14} />
                      <h4 className="font-semibold text-red-500 text-sm">{t("result.warnings")}</h4>
                    </div>
                    <ul className="space-y-1 text-left">
                      {med.warnings?.map((warning, i) => (
                        <li key={i} className="flex items-start text-red-600 text-xs">
                          <span className="w-1 h-1 bg-red-400 rounded-full mr-2 mt-1"></span>
                          {t(`detail.${warning}`)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          ))
        )}
      </div>

      {/* Back to Home Button */}
      <div className="max-w-4xl mx-auto mt-8 mb-8 flex justify-center">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 px-6 py-3 bg-[#FF4B28] text-white rounded-lg hover:bg-[#E63E1E] transition-colors duration-200 shadow-md"
        >
          <Home size={20} />
          <span>{t("result.backToHome")}</span>
        </button>
      </div>

      {/* Emergency Contact */}
      <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-50 rounded-lg border border-red-200 flex items-center">
        <AlertCircle className="text-red-500 mr-3" />
        <div>
          <p className="text-left font-semibold text-red-500">
            {t("result.emergencyTitle")}
          </p>
          <p className="text-red-600">
            {t("result.emergencyContact")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
