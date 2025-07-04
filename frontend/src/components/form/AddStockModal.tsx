import React, { useState } from 'react';
import { Card } from '../ui/card';
import { X } from 'lucide-react';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: {
    id: number;
    name: string;
    image_url: string;
    type: string;
    strength: number;
  };
}

const AddStockModal: React.FC<AddStockModalProps> = ({ isOpen, onClose, medicine }) => {
  const [stockAmount, setStockAmount] = useState<number>(0);
  const [expiryDate, setExpiryDate] = useState<string>(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <img
              src={medicine.image_url}
              alt={medicine.name}
              className="w-16 h-16 object-contain rounded-lg border"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Add New Stock</h2>
              <p className="text-sm text-gray-500">{medicine.name}</p>
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
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Amount
            </label>
            <input
              type="number"
              value={stockAmount}
              onChange={(e) => setStockAmount(parseInt(e.target.value) || 0)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              min="0"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
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
            Add Stock
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AddStockModal; 