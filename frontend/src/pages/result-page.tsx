import { HeartPulse, AlertCircle, Clock, Calendar, Info } from 'lucide-react';

const ResultsPage = () => {
  const studentQuota = {
    maxPerMonth: 5,
    used: 2,
    remaining: 3,
    resetDate: '1 Feb 2025'
  };

  const prescribedMedications = [
    {
      name: 'Paracetamol 500mg',
      quantity: '6 tablets',
      frequency: 'Every 4-6 hours',
      type: 'Oval white tablet',
      imageSize: { width: 200, height: 150 },
      instructions: [
        'Take with or after food',
        'Maximum 8 tablets per day',
        'Do not exceed recommended dose'
      ],
      warnings: [
        'Avoid alcohol',
        'If symptoms persist after 3 days, consult doctor'
      ]
    },
    {
      name: 'Cold Relief Syrup',
      quantity: '1 bottle (60ml)',
      frequency: 'Every 6 hours',
      type: 'Red syrup liquid',
      imageSize: { width: 150, height: 200 },
      instructions: [
        'Take 10ml using provided cap',
        'Can be taken with water',
        'Store in cool place'
      ],
      warnings: [
        'May cause drowsiness',
        'Do not drive after taking'
      ]
    }
  ];

  return (
    <div className="min-h-screen p-8">
      {/* Header with Robot */}
      <div className="text-center mb-8">
        <div className="text-6xl font-bold text-[#FF4B28] animate-bounce-slow">(｡^‿^｡)</div>
        <h1 className="text-4xl font-bold mt-4 text-[#FF4B28]">Your Medications</h1>
        <p className="text-gray-600 mt-2">Please read all instructions carefully</p>
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
            <p className="text-2xl font-bold text-[#FF4B28]">{studentQuota.used}/{studentQuota.maxPerMonth}</p>
          </div>
          <div className="text-center p-3 bg-[#F5F7F9] rounded-lg">
            <p className="text-sm text-gray-600">Remaining</p>
            <p className="text-2xl font-bold text-[#FFC926]">{studentQuota.remaining}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Resets on {studentQuota.resetDate}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {prescribedMedications.map((med, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#FF4B28]"
          >
            <div className="grid md:grid-cols-3 gap-6">
              {/* Image Section */}
              <div className="md:col-span-1">
                <div className="bg-[#F5F7F9] rounded-lg p-4 flex flex-col items-center">
                  <img 
                    src={`https://pixelbuddha.net/storage/55217/conversions/pills-mockup-free-download-by-pixelbuddha-main-x2-medium.jpg`}
                    alt={med.name}
                    className="rounded-lg shadow-md"
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
                    <h3 className="text-xl font-bold text-[#FF4B28]">{med.name}</h3>
                    <p className="text-gray-600">Quantity: {med.quantity}</p>
                  </div>
                  <div className="bg-[#F5F7F9] px-4 py-2 rounded-lg">
                    <Clock className="inline-block mr-2" size={16} />
                    {med.frequency}
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Instructions:</h4>
                    <ul className="space-y-2">
                      {med.instructions.map((instruction, i) => (
                        <li key={i} className="flex items-center text-gray-600">
                          <span className="w-2 h-2 bg-[#FFC926] rounded-full mr-2"></span>
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="text-red-500 mr-2" size={16} />
                      <h4 className="font-semibold text-red-500">Warnings:</h4>
                    </div>
                    <ul className="space-y-2">
                      {med.warnings.map((warning, i) => (
                        <li key={i} className="flex items-center text-red-600">
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
          <p className="text-left font-semibold text-red-500">In case of emergency:</p>
          <p className="text-red-600">Contact HCU: 1234 or Visit nearest hospital</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;