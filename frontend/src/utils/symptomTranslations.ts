// Symptom translation mappings
// Maps database symptom names to translation keys

export const symptomTranslationMap: Record<string, string> = {
  'Diarrhea': 'symptoms.diarrhea',
  'Bloating': 'symptoms.bloating',
  'Headache': 'symptoms.headache',
  'Fever': 'symptoms.fever',
  'Toothache': 'symptoms.toothache',
  'Menstrual Pain': 'symptoms.menstrualPain',
  'Back/Shoulder/Muscle/Joint Pain': 'symptoms.backShoulderMuscleJointPain',
  'Muscle Pain': 'symptoms.musclePain',
  'Tremors (Parkinson\'s Disease)': 'symptoms.tremors',
};

// Helper function to get translated symptom name
export const getTranslatedSymptomName = (symptomName: string, t: (key: string) => string): string => {
  const translationKey = symptomTranslationMap[symptomName];
  if (translationKey) {
    return t(translationKey);
  }
  // Fallback to original name if no translation found
  return symptomName;
};

// Helper function to get translation key for a symptom
export const getSymptomTranslationKey = (symptomName: string): string => {
  return symptomTranslationMap[symptomName] || symptomName;
}; 