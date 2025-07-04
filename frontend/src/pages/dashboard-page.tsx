import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import EditStockModal from "../components/form/EditStockModal";
import AddStockModal from "../components/form/AddStockModal";
import { Plus } from "lucide-react";
import Header from "../components/layout/Header";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Cell
} from "recharts";
import { getMedRanking, getMedRequest, getMedStock } from "@/api/med";
import { MedRanking, MedRequest } from "@/types";

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
    console.log(uniqueMedNames);
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
  }, []);

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
    <div className="min-h-screen w-full bg-white max-w-none">
      <Header activePage="medicine" />

      {/* Title */}
      <div className="px-8 py-4 flex items-center gap-2">
        <span className="text-2xl font-semibold text-gray-800"><i className="fa-solid fa-pills mr-2" style={{ color: 'rgb(249 115 22)' }} />Medicine</span>
      </div>
      {/* Main Content */}
      <div className="px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Medicine Stock */}
        <Card className="col-span-1 border-orange-200 shadow-sm">
          <CardHeader className="bg-orange-50 border-b border-orange-200">
            <CardTitle className="text-gray-800">Current Medicine Stock</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-orange-200 bg-orange-50">
                  <th className="px-4 py-2 text-left text-gray-700">Medicine ID</th>
                  <th className="px-4 py-2 text-left text-gray-700">Image</th>
                  <th className="px-4 py-2 text-left text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-gray-700">In Stock</th>
                  <th className="px-4 py-2 text-left text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicineStock.map((med, idx) => (
                  <tr key={idx} className="border-b border-orange-100 last:border-0 hover:bg-orange-50">
                    <td className="px-4 py-2">{med.id}</td>
                    <td className="px-4 py-2"><img src={med.image_url} alt="med" className="w-12 h-12 object-contain" /></td>
                    <td className="px-4 py-2">{med.name}</td>
                    <td className={`px-4 py-2 font-semibold ${med.valid_stock === 0 ? "text-red-500" : "text-green-600"}`}>{med.valid_stock}/30</td>
                    <td className="flex items-center gap-2 px-4 py-2">
                      <button 
                        onClick={() => handleAddClick(med)}
                        className="text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center gap-1 bg-white border border-orange-200 rounded-md px-2 py-1"
                        style={{ color: 'rgb(249 115 22)' }}
                      >
                        <Plus size={16} />
                        Add
                      </button>
                      <button 
                        onClick={() => handleEditClick(med)}
                        className="text-blue-600 hover:text-blue-700 hover:underline bg-white border border-blue-200 rounded-md px-2 py-1"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        {/* Right: Top 5 Dispensed Medicines */}
        <Card className="col-span-1 border-orange-200 shadow-sm">
          <CardHeader className="bg-orange-50 border-b border-orange-200">
            <CardTitle className="text-gray-800">Top 5 All Time Dispensed Medicines</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={topDispensed}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#fef3c7" />
                <XAxis 
                  dataKey="medicine_name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid rgb(249 115 22)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="total" isAnimationActive fill="rgb(249 115 22)">
                  {topDispensed.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      {/* Bottom: Daily Medicine Requests */}
      <div className="px-8 mt-6">
        <Card className="border-orange-200 shadow-sm mb-6">
          <CardHeader className="flex flex-row items-center justify-between bg-orange-50 border-b border-orange-200">
            <CardTitle className="text-gray-800">Daily Medicine Requests</CardTitle>
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => changeDate(e.target.value)}
                className="border border-orange-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-orange-500 text-white"
              />
            </div>
          </CardHeader>
          <CardContent className="h-80 pt-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={transformDataForChart(medRequest)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fef3c7" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid rgb(249 115 22)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                {transformDataForChart(medRequest).length > 0 && getIdenticalMed(medRequest[0]).map((medName, idx) => (
                  <Line 
                    key={idx} 
                    type="monotone" 
                    dataKey={medName} 
                    stroke={idx === 0 ? "rgb(249 115 22)" : `hsl(${idx * 120}, 70%, 50%)`}
                    activeDot={{ r: 6 }} 
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
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
