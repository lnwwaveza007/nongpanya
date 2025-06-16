import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import EditStockModal from "../components/form/EditStockModal";
import AddStockModal from "../components/form/AddStockModal";
import { Plus } from "lucide-react";
import Header from "../components/layout/Header";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Cell
} from "recharts";

interface Medicine {
  id: number;
  name: string;
  image_url: string;
  type: string;
  strength: number;
  valid_stock: number;
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

const medicineStock = [
  {
    id: 1,
    name: "Activated Charcoal 260 mg",
    image_url: "https://i.ibb.co/CB2zvF7/carbon.jpg",
    type: "Capsule",
    description: "Activated Charcoal 260 mg is used to treat diarrhea, bloating, and to absorb toxins in the digestive system. It is suitable for both children and adults.",
    strength: 260,
    medicine_stocks: [
      {
        id: 1,
        medicine_id: 1,
        stock_amount: 20,
        expire_at: "2025-12-31T00:00:00.000Z",
        created_at: "2025-06-16T19:38:50.000Z",
        updated_at: "2025-06-16T19:38:50.000Z",
        is_expired: false
      },
      {
        id: 2,
        medicine_id: 1,
        stock_amount: 10,
        expire_at: "2026-06-30T00:00:00.000Z",
        created_at: "2025-06-16T19:38:50.000Z",
        updated_at: "2025-06-16T19:38:50.000Z",
        is_expired: false
      }
    ],
    valid_stock: 30,
    expired_stock: 0
  },
  {
    id: 2,
    name: "Paracetamol 500 mg (Acetaminophen)",
    image_url: "https://i.ibb.co/nsgyrQX/para.jpg",
    type: "Tablet",
    description: "Paracetamol 500 mg tablet is used to reduce fever and relieve mild to moderate pain, such as headaches, toothaches, and muscle pain. Suitable for adults and children above 12 years. Store in a cool, dry place below 30°C.",
    strength: 500,
    medicine_stocks: [
      {
        id: 3,
        medicine_id: 2,
        stock_amount: 15,
        expire_at: "2025-11-15T00:00:00.000Z",
        created_at: "2025-06-16T19:38:50.000Z",
        updated_at: "2025-06-16T19:38:50.000Z",
        is_expired: false
      }
    ],
    valid_stock: 15,
    expired_stock: 0
  },
  {
    id: 3,
    name: "Tolperisone 50 mg",
    image_url: "https://i.ibb.co/L13F3t8/tero.jpg",
    type: "Tablet",
    description: "Tolperisone 50 mg is a muscle relaxant used to relieve pain caused by muscle tension or spasms and to treat tremors in conditions like Parkinson's disease.",
    strength: 50,
    medicine_stocks: [
      {
        id: 4,
        medicine_id: 3,
        stock_amount: 30,
        expire_at: "2025-09-01T00:00:00.000Z",
        created_at: "2025-06-16T19:38:50.000Z",
        updated_at: "2025-06-16T19:38:50.000Z",
        is_expired: false
      },
      {
        id: 5,
        medicine_id: 3,
        stock_amount: 10,
        expire_at: "2026-01-01T00:00:00.000Z",
        created_at: "2025-06-16T19:38:50.000Z",
        updated_at: "2025-06-16T19:38:50.000Z",
        is_expired: false
      }
    ],
    valid_stock: 40,
    expired_stock: 0
  }
];

const topDispensed = [
  { medicine_id: 1, medicine_name: "Activated Charcoal 260 mg", total: 2, fill: "#0000FF" },
  { medicine_id: 2, medicine_name: "Paracetamol 500 mg (Acetaminophen)", total: 2, fill: "#3CB371" },
  { medicine_id: 3, medicine_name: "Tolperisone 50 mg", total: 2, fill: "#FFA500" }
];

const dailyRequests = [
  {
    time: "2025-06-14T01:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 0
  },
  {
    time: "2025-06-14T02:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 18
  },
  {
    time: "2025-06-14T03:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 0
  },
  {
    time: "2025-06-14T04:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 0
  },
  {
    time: "2025-06-14T05:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 0
  },
  {
    time: "2025-06-14T06:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 0
  },
  {
    time: "2025-06-14T07:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 0
  },
  {
    time: "2025-06-14T08:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 0
  },
  {
    time: "2025-06-14T09:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 0
  },
  {
    time: "2025-06-14T10:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 0
  },
  {
    time: "2025-06-14T11:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 0
  },
  {
    time: "2025-06-14T12:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 0
  },
  {
    time: "2025-06-14T13:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 0
  },
  {
    time: "2025-06-14T14:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 0
  },
  {
    time: "2025-06-14T15:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 0
  },
  {
    time: "2025-06-14T16:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 0
  },
  {
    time: "2025-06-14T17:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 0
  },
  {
    time: "2025-06-14T18:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 0
  },
  {
    time: "2025-06-14T19:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 0
  },
  {
    time: "2025-06-14T20:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 0
  },
  {
    time: "2025-06-14T21:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 0
  },
  {
    time: "2025-06-14T22:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 0
  },
  {
    time: "2025-06-14T23:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 0
  },
  {
    time: "2025-06-15T00:00:00.000Z",
    "Activated Charcoal 260 mg": 0,
    "Paracetamol 500 mg (Acetaminophen)": 0,
    "Tolperisone 50 mg": 0
  }
];

export default function DashboardPage() {
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleEditClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsEditModalOpen(true);
  };

  const handleAddClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsAddModalOpen(true);
  };

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
            <CardTitle>Top 5 Dispensed Medicines</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topDispensed}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="medicine_name" />
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
            <span className="bg-orange-100 text-orange-600 rounded px-2 py-1 text-xs font-semibold">2024-08-15</span>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyRequests} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Activated Charcoal 260 mg" stroke="#FDBA74" activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Paracetamol 500 mg (Acetaminophen)" stroke="#60A5FA" activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Tolperisone 50 mg" stroke="#22C55E" activeDot={{ r: 6 }} />
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
