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
    <div className="min-h-screen w-full bg-gray-100 max-w-none">
      <Header activePage="medicine" />

      {/* Title */}
      <div className="px-8 py-4 flex items-center gap-2">
        <span className="text-2xl font-semibold text-gray-700"><i className="fa-solid fa-pills mr-2 text-orange-500" />Medicine</span>
      </div>
      {/* Main Content */}
      <div className="px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Medicine Stock */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Current Medicine Stock</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Medicine ID</th>
                  <th className="px-4 py-2 text-left">Image</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">In Stock</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicineStock.map((med, idx) => (
                  <tr key={idx} className="border-b last:border-0">
                    <td className="px-4 py-2">{med.id}</td>
                    <td className="px-4 py-2"><img src={med.image_url} alt="med" className="w-12 h-12 object-contain" /></td>
                    <td className="px-4 py-2">{med.name}</td>
                    <td className={`px-4 py-2 font-semibold ${med.valid_stock === 0 ? "text-red-500" : "text-green-500"}`}>{med.valid_stock}/30</td>
                    <td className="px-4 py-2 space-x-2">
                      <button 
                        onClick={() => handleAddClick(med)}
                        className="text-green-500 hover:text-green-700 hover:underline inline-flex items-center gap-1"
                      >
                        <Plus size={16} />
                        Add
                      </button>
                      <button 
                        onClick={() => handleEditClick(med)}
                        className="text-blue-500 hover:text-blue-700 hover:underline"
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
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top 5 All Time Dispensed Medicines</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={topDispensed}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="medicine_name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  tick={{ fontSize: 10 }}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" isAnimationActive fill="#8884d8">
                  {topDispensed.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      {/* Bottom: Daily Medicine Requests */}
      <div className="px-8 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Daily Medicine Requests</CardTitle>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => changeDate(e.target.value)}
                className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={transformDataForChart(medRequest)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                {transformDataForChart(medRequest).length > 0 && getIdenticalMed(medRequest[0]).map((medName, idx) => (
                  <Line 
                    key={idx} 
                    type="monotone" 
                    dataKey={medName} 
                    stroke={`hsl(${idx * 120}, 70%, 50%)`} 
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
