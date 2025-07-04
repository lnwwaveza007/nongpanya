import React, { useState } from 'react';
import { Card } from '../ui/card';
import { X, Plus, Trash2 } from 'lucide-react';
import { MedicineStock } from '@/types/medicine';

interface StockEntry {
  id: number;
  stock_amount: number;
  expire_at: string;
}

interface EditStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: MedicineStock;
}

const EditStockModal: React.FC<EditStockModalProps> = ({ isOpen, onClose, medicine }) => {
  const [stockEntries, setStockEntries] = useState<StockEntry[]>(medicine.medicine_stocks);

  const addNewStock = () => {
    const newEntry: StockEntry = {
      id: Date.now(), // Temporary ID for new entries
      stock_amount: 0,
      expire_at: new Date().toISOString().split('T')[0]
    };
    setStockEntries([...stockEntries, newEntry]);
  };

  const removeStock = (id: number) => {
    setStockEntries(stockEntries.filter(entry => entry.id !== id));
  };

  const updateStockEntry = (id: number, field: keyof StockEntry, value: string | number) => {
    setStockEntries(stockEntries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <img
              src={medicine.image_url}
              alt={medicine.name}
              className="w-16 h-16 object-contain rounded-lg border"
            />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{medicine.name}</h2>
              <p className="text-sm text-gray-500">
                {medicine.type} • {medicine.strength}mg
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-md px-2 py-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Stock Entries</h3>
            <button
              onClick={addNewStock}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add Stock
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Stock Amount</th>
                  <th className="px-4 py-2 text-left">Expiry Date</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stockEntries.map((entry) => (
                  <tr key={entry.id} className="border-b last:border-0">
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={entry.stock_amount}
                        onChange={(e) => updateStockEntry(entry.id, 'stock_amount', parseInt(e.target.value) || 0)}
                        className="w-24 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="date"
                        value={entry.expire_at.split('T')[0]}
                        onChange={(e) => updateStockEntry(entry.id, 'expire_at', e.target.value)}
                        className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => removeStock(entry.id)}
                        className="text-red-500 hover:text-red-700 bg-white border border-red-200 rounded-md px-2 py-1"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </Card>
    </div>
  );
};

export default EditStockModal; 