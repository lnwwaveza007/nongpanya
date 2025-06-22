import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Search, Filter, Clock, CheckCircle2, AlertCircle, Eye, Calendar } from "lucide-react";
import UserLogDetailModal from "../components/form/UserLogDetailModal";
import Header from "../components/layout/Header";

interface Medicine {
  id: number;
  name: string;
  image_url: string;
  description: string;
}

interface Symptom {
  id: number;
  name: string;
  description: string;
}

interface UserLog {
  code: string;
  user_id: string;
  fullname: string;
  email: string;
  weight: string;
  additional_notes: string;
  allergies: string;
  status: string;
  created_at: string;
  updated_at: string;
  medicines: Medicine[];
  symptoms: Symptom[];
}

// Mock data
const userLogs = {
  success: true,
  data: [
    {
      code: "1",
      user_id: "USR00000001",
      fullname: "Alice Smith",
      email: "alice@example.com",
      weight: "54.5",
      additional_notes: "Fever and headache after travel",
      allergies: "",
      status: "completed",
      created_at: "2025-06-16T19:38:50.000Z",
      updated_at: "2025-06-16T19:38:50.000Z",
      medicines: [
        {
          id: 2,
          name: "Paracetamol 500 mg (Acetaminophen)",
          image_url: "https://i.ibb.co/nsgyrQX/para.jpg",
          description: "Paracetamol 500 mg tablet is used to reduce fever and relieve mild to moderate pain, such as headaches, toothaches, and muscle pain. Suitable for adults and children above 12 years. Store in a cool, dry place below 30°C."
        }
      ],
      symptoms: [
        {
          id: 3,
          name: "Headache",
          description: "Pain or discomfort in the head or upper neck, often described as throbbing, sharp, or dull."
        },
        {
          id: 4,
          name: "Fever",
          description: "An increase in body temperature above the normal range, often a sign of infection or inflammation."
        }
      ]
    },
  ],
  message: "Data retrieved successfully"
};

const UserLogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedLog, setSelectedLog] = useState<UserLog | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleViewDetail = (log: UserLog) => {
    setSelectedLog(log);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedLog(null);
  };

  const filteredLogs = userLogs.data.filter(log => {
    const matchesSearch = 
      log.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.code.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    
    // Date filtering
    let matchesDate = true;
    if (startDate || endDate) {
      const logDate = new Date(log.created_at);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start && end) {
        matchesDate = logDate >= start && logDate <= end;
      } else if (start) {
        matchesDate = logDate >= start;
      } else if (end) {
        matchesDate = logDate <= end;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
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
    <div className="min-h-screen w-full bg-gray-100 max-w-none">
      <Header activePage="user-log" />

      {/* Title */}
      <div className="px-8 py-4 flex items-center gap-2">
        <span className="text-2xl font-semibold text-gray-700">
          <i className="fa-solid fa-users mr-2 text-orange-500" />
          User Logs
        </span>
      </div>

      {/* Filters */}
      <div className="px-8 mb-6">
        <Card>
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
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    onClick={() => setStatusFilter("all")}
                    className="flex items-center gap-2"
                  >
                    <Filter size={16} />
                    All
                  </Button>
                  <Button
                    variant={statusFilter === "completed" ? "default" : "outline"}
                    onClick={() => setStatusFilter("completed")}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 size={16} />
                    Completed
                  </Button>
                  <Button
                    variant={statusFilter === "pending" ? "default" : "outline"}
                    onClick={() => setStatusFilter("pending")}
                    className="flex items-center gap-2"
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
                    className="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Start Date"
                  />
                  <span className="text-gray-500 self-center">to</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="text-red-600 hover:text-red-700"
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
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left">Code</th>
                    <th className="px-4 py-3 text-left">User</th>
                    <th className="px-4 py-3 text-left">Symptoms</th>
                    <th className="px-4 py-3 text-left">Medicines</th>
                    <th className="px-4 py-3 text-left">Notes</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.code} className="border-b hover:bg-gray-50">
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
                          className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1"
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