import { axiosInstance } from "@/utils/axiosInstance";
import { HeartPulse, AlertCircle, Clock, Calendar, Info } from "lucide-react";
import {
  useState,
  useEffect,
} from "react";
import { useLocation } from "react-router-dom";

interface Medical {
  imageUrl: string;
  name: string;
  type: string;
  quantity: number;
  frequency: number;
  instructions: any[];
  warnings: any[];
}

const ResultsPage = () => {
  const [used, setUsed] = useState(0);
  const prescribedMedications = useLocation().state?.data;

  useEffect(() => {
    axiosInstance.get("/user/qouta").then((res) => {
      setUsed(res.data.data);
    });
  }, []);

  const studentQuota = {
    maxPerMonth: 5,
    used: used,
    resetDate: "1 Feb 2025",
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header with Robot */}
      <div className="text-center mb-8">
        <div className="text-6xl font-bold text-[#FF4B28] animate-bounce-slow">
          (｡^‿^｡)
        </div>
        <h1 className="text-4xl font-bold mt-4 text-[#FF4B28]">
          Your Medications
        </h1>
        <p className="text-gray-600 mt-2">
          Please read all instructions carefully
        </p>
      </div>

      {/* Quota Card */}
      <div className="max-w-md mx-auto mb-8 bg-white rounded-xl shadow-lg p-6 border-2 border-[#FF4B28]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#FF4B28]">Monthly Quota</h2>
          <HeartPulse className="text-[#FF4B28]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-[#F5F7F9] rounded-lg">
            <p className="text-sm text-gray-600">Used</p>
            <p className="text-2xl font-bold text-[#FF4B28]">
              {studentQuota.used}/{studentQuota.maxPerMonth}
            </p>
          </div>
          <div className="text-center p-3 bg-[#F5F7F9] rounded-lg">
            <p className="text-sm text-gray-600">Remaining</p>
            <p className="text-2xl font-bold text-[#FFC926]">
              {studentQuota.maxPerMonth - studentQuota.used}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Resets on {studentQuota.resetDate}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {prescribedMedications?.map((med : Medical, index: number) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#FF4B28]"
          >
            <div className="grid md:grid-cols-3 gap-6">
              {/* Image Section */}
              <div className="md:col-span-1">
                <div className="bg-[#F5F7F9] rounded-lg p-4 flex flex-col items-center">
                  <img
                    src={med.imageUrl}
                    alt={med.name}
                    className="rounded-lg shadow-md"
                    // width={med.imageSize.width}
                    // height={med.imageSize.height}
                  />
                  <div className="mt-3 text-center">
                    <p className="text-sm text-gray-600">{med.type}</p>
                    <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
                      <Info className="w-3 h-3 mr-1" />
                      <span>Representative image</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="md:col-span-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl text-left font-bold text-[#FF4B28]">
                      {med.name}
                    </h3>
                    <p className="text-gray-600 text-left">
                      Quantity: {med.quantity}
                    </p>
                  </div>
                  <div className="bg-[#F5F7F9] px-4 py-2 rounded-lg">
                    <Clock className="inline-block mr-2" size={16} />
                    {med.frequency}
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Instructions:</h4>
                    <ul className="space-y-2 text-left">
                      <li key="zero" className="flex items-center text-gray-600">
                          <span className="w-2 h-2 bg-[#FFC926] rounded-full mr-2"></span>
                          We dispense 2 doses, take half in the first round.
                      </li>
                      {med.instructions?.map((instruction, i) => (
                        <li key={i} className="flex items-center text-gray-600">
                          <span className="w-2 h-2 bg-[#FFC926] rounded-full mr-2"></span>
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-start mb-2">
                      <AlertCircle className="text-red-500 mr-2" size={16} />
                      <h4 className="font-semibold text-red-500">Warnings:</h4>
                    </div>
                    <ul className="space-y-2 text-left">
                      {med.warnings?.map((warning, i) => (
                        <li key={i} className="flex items-start text-red-600">
                          <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Contact */}
      <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-50 rounded-lg border border-red-200 flex items-center">
        <AlertCircle className="text-red-500 mr-3" />
        <div>
          <p className="text-left font-semibold text-red-500">
            In case of emergency:
          </p>
          <p className="text-red-600">
            Contact HCU: 1234 or Visit nearest hospital
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
