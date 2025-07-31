import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import EditStockModal from "../components/form/EditStockModal";
import AddStockModal from "../components/form/AddStockModal";
import { Plus, Pill, BarChart3, TrendingUp, AlertTriangle, Edit } from "lucide-react";
import Header from "../components/layout/Header";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Cell
} from "recharts";
import { getMedRanking, getMedRequest, getMedStock } from "@/api/med";
import { MedRanking, MedRequest } from "@/types";
import { useTranslation } from "react-i18next";
import LanguageToggle from "@/components/ui/language-toggle";
import MedicineImage from "@/components/ui/medicine-image";

interface Medicine {
  id: number;
  name: string;
  image_url: string;
  type: string;
  strength: number;
  valid_stock: number;
  description: string;
  medicine_stocks: Array<{
    id: number;
    medicine_id: number;
    stock_amount: number;
    expire_at: string;
    created_at: string;
    updated_at: string;
    is_expired: boolean;
  }>;
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [medicineStock, setMedicineStock] = useState<Medicine[]>([]);
  const [topDispensed, setTopDispensed] = useState<MedRanking[]>([]);
  const [medRequest, setMedRequest] = useState<MedRequest[]>([]);

  const getMedicineStock = async () => {
    const response = await getMedStock();
    const data = response.data.data;
    setMedicineStock(data);
  }

  const getTopDispensedMedicines = async () => {
    const response = await getMedRanking();
    const data = response.data.data;
    setTopDispensed(data);
  }

  const getMedRequestTimeseries = async () => {
    const response = await getMedRequest(selectedDate);
    const data = response.data.data;
    setMedRequest(data);
  }

  const getIdenticalMed = (med: MedRequest) => {
    const medNames = med.medicine.map((med) => med.medicine_name);
    const uniqueMedNames = [...new Set(medNames)];
    return uniqueMedNames;
  }

  // Transform data for LineChart
  const transformDataForChart = (data: MedRequest[]) => {
    if (data.length === 0) return [];
    
    // Transform data to have time and individual medicine totals
    return data.map(item => {
      const transformed: Record<string, string | number> = {
        time: new Date(item.time).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })
      };
      
      // Add each medicine's total to the object
      item.medicine.forEach(med => {
        transformed[med.medicine_name] = med.total;
      });
      
      return transformed;
    });
  };

  useEffect(() => {
    getMedicineStock();
    getTopDispensedMedicines();
    getMedRequestTimeseries();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEditClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsEditModalOpen(true);
  };

  const handleAddClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsAddModalOpen(true);
  };

  const changeDate = (date: string) => {
    setSelectedDate(date);
    getMedRequestTimeseries();
  }

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedMedicine(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activePage="dashboard" />
      <LanguageToggle variant="floating" />

      {/* Title Section */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-md p-4 border-2 border-[#FF4B28] mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#FF4B28]/10 p-2 rounded-lg">
              <Pill size={24} className="text-[#FF4B28]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#FF4B28]">
                {t("dashboard.title")}
              </h1>
              <p className="text-gray-600 text-sm">Monitor medicine inventory and dispensing analytics</p>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
          {/* Medicine Stock Card */}
          <Card className="border-2 border-[#FF4B28] shadow-lg overflow-hidden">
            <CardHeader className="bg-[#FF4B28] text-white py-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <Pill size={16} />
                </div>
                {t("dashboard.currentStock")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#FF4B28]/20 bg-gray-50">
                      <th className="px-3 py-2 text-left text-gray-700 font-semibold">{t("dashboard.medicineId")}</th>
                      <th className="px-3 py-2 text-left text-gray-700 font-semibold">{t("dashboard.image")}</th>
                      <th className="px-3 py-2 text-left text-gray-700 font-semibold">{t("dashboard.name")}</th>
                      <th className="px-3 py-2 text-left text-gray-700 font-semibold">{t("dashboard.inStock")}</th>
                      <th className="px-3 py-2 text-left text-gray-700 font-semibold">{t("dashboard.actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicineStock.map((med, idx) => (
                      <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-2 font-medium">{med.id}</td>
                        <td className="px-3 py-2">
                          <MedicineImage
                            medicine={med}
                            size="sm"
                            className="object-contain rounded-lg"
                          />
                        </td>
                        <td className="px-3 py-2 font-medium">{med.name}</td>
                        <td className={`px-3 py-2 font-bold ${med.valid_stock === 0 ? "text-red-500" : med.valid_stock < 5 ? "text-yellow-600" : "text-green-600"}`}>
                          {med.valid_stock}/30
                          {med.valid_stock < 5 && (
                            <AlertTriangle size={14} className="ml-2 text-yellow-600" />
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1">
                            <Button 
                              onClick={() => handleAddClick(med)}
                              size="sm"
                              variant="outline"
                              className="border-2 border-[#FF4B28] text-[#FF4B28] hover:bg-[#FF4B28] hover:text-white transition-all duration-200 shadow-sm h-7 px-2 text-xs"
                            >
                              <Plus size={12} className="mr-1" />
                              {t("dashboard.add")}
                            </Button>
                            <Button 
                              onClick={() => handleEditClick(med)}
                              size="sm"
                              variant="outline"
                              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-sm h-7 px-2 text-xs"
                            >
                              <Edit size={12} className="mr-1" />
                              {t("dashboard.edit")}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Top Dispensed Medicines Card */}
          <Card className="border-2 border-[#FF4B28] shadow-lg overflow-hidden">
            <CardHeader className="bg-[#FF4B28] text-white py-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <BarChart3 size={16} />
                </div>
                {t("dashboard.topDispensed")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-[90%] flex flex-col justify-end">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={topDispensed}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="medicine_name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      tick={{ fontSize: 10 }}
                      stroke="#64748b"
                    />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '2px solid #FF4B28',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="total" radius={6}>
                      {topDispensed.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${12 + index * 45}, 85%, 60%)`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Medicine Requests Chart */}
        <Card className="border-2 border-[#FF4B28] shadow-lg overflow-hidden">
          <CardHeader className="bg-[#FF4B28] text-white py-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <TrendingUp size={16} />
                </div>
                Daily Medicine Requests
              </CardTitle>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => changeDate(e.target.value)}
                className="border-2 border-white/30 rounded-lg px-2 py-1 text-xs bg-white/20 text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transformDataForChart(medRequest)} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #FF4B28',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  {transformDataForChart(medRequest).length > 0 && getIdenticalMed(medRequest[0]).map((medName, idx) => (
                    <Line 
                      key={idx} 
                      type="monotone" 
                      dataKey={medName} 
                      stroke={idx === 0 ? "#FF4B28" : `hsl(${12 + idx * 120}, 70%, 50%)`}
                      strokeWidth={3}
                      dot={{ fill: idx === 0 ? "#FF4B28" : `hsl(${12 + idx * 120}, 70%, 50%)`, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: idx === 0 ? "#FF4B28" : `hsl(${12 + idx * 120}, 70%, 50%)`, strokeWidth: 2 }} 
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Stock Alert Section */}
        {medicineStock.filter(med => med.valid_stock < 5).length > 0 && (
          <Card className="border-2 border-red-200 shadow-lg overflow-hidden mt-6">
            <CardHeader className="bg-red-50 border-b-2 border-red-200 py-3">
              <CardTitle className="flex items-center gap-2 text-base text-red-700">
                <div className="bg-red-100 p-1.5 rounded-lg">
                  <AlertTriangle size={16} className="text-red-600" />
                </div>
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {medicineStock.filter(med => med.valid_stock < 5).map((med) => (
                  <div key={med.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <MedicineImage medicine={med} size="sm" className="rounded-lg" />
                      <div>
                        <h4 className="font-semibold text-red-900 text-sm">{med.name}</h4>
                        <p className="text-red-700 text-xs">Only {med.valid_stock} left</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals */}
      {selectedMedicine && (
        <>
          <EditStockModal
            isOpen={isEditModalOpen}
            onClose={handleCloseModal}
            medicine={selectedMedicine}
          />
          <AddStockModal
            isOpen={isAddModalOpen}
            onClose={handleCloseModal}
            medicine={selectedMedicine}
          />
        </>
      )}
    </div>
  );
}
