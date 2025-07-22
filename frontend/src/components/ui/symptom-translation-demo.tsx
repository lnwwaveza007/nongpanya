import { useSymptomTranslation } from '@/hooks/useSymptomTranslation';
import { Card } from '@/components/ui/card';
import LanguageToggle from './language-toggle';

// Demo component showing symptom translations
export const SymptomTranslationDemo = () => {
  const { translateSymptom, translateSymptomList } = useSymptomTranslation();

  // Sample symptoms from database
  const sampleSymptoms = [
    { id: '1', name: 'Diarrhea', icon: '💩' },
    { id: '2', name: 'Headache', icon: '🤕' },
    { id: '3', name: 'Fever', icon: '🤒' },
    { id: '4', name: 'Toothache', icon: '🦷' },
    { id: '5', name: 'Muscle Pain', icon: '💪' },
  ];

  const translatedSymptoms = translateSymptomList(sampleSymptoms);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Symptom Translation Demo</h2>
        <LanguageToggle variant="inline" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Database Names */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Database Names (English)</h3>
          <div className="space-y-2">
            {sampleSymptoms.map((symptom) => (
              <div key={symptom.id} className="flex items-center gap-2">
                <span>{symptom.icon}</span>
                <span className="font-mono text-sm">{symptom.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Translated Names */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Translated Names (Current Language)</h3>
          <div className="space-y-2">
            {translatedSymptoms.map((symptom) => (
              <div key={symptom.id} className="flex items-center gap-2">
                <span>{symptom.icon}</span>
                <span className="font-medium">{symptom.translatedName}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Individual Translation Examples */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Individual Translation Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Database Name:</p>
            <p className="font-mono">"Back/Shoulder/Muscle/Joint Pain"</p>
            <p className="text-sm text-gray-600 mt-2">Translated:</p>
            <p className="font-medium">{translateSymptom('Back/Shoulder/Muscle/Joint Pain')}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Database Name:</p>
            <p className="font-mono">"Tremors (Parkinson's Disease)"</p>
            <p className="text-sm text-gray-600 mt-2">Translated:</p>
            <p className="font-medium">{translateSymptom('Tremors (Parkinson\'s Disease)')}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Database Name:</p>
            <p className="font-mono">"Menstrual Pain"</p>
            <p className="text-sm text-gray-600 mt-2">Translated:</p>
            <p className="font-medium">{translateSymptom('Menstrual Pain')}</p>
          </div>
        </div>
      </Card>

      <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
        <p><strong>How it works:</strong></p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Symptoms are stored in the database with English names</li>
          <li>The translation mapping maps database names to translation keys</li>
          <li>i18n system provides translations for each key</li>
          <li>When language changes, symptoms automatically update</li>
          <li>Fallback to original name if translation not found</li>
        </ul>
      </div>
    </div>
  );
}; 