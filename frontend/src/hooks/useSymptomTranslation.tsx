import { useTranslation } from 'react-i18next';
import { getTranslatedSymptomName, getSymptomTranslationKey } from '@/utils/symptomTranslations';

export const useSymptomTranslation = () => {
  const { t } = useTranslation();

  const translateSymptom = (symptomName: string): string => {
    return getTranslatedSymptomName(symptomName, t);
  };

  const getTranslationKey = (symptomName: string): string => {
    return getSymptomTranslationKey(symptomName);
  };

  const translateSymptomList = (symptoms: Array<{ id: string; name: string; icon?: React.ReactNode }>) => {
    return symptoms.map(symptom => ({
      ...symptom,
      translatedName: translateSymptom(symptom.name)
    }));
  };

  return {
    translateSymptom,
    getTranslationKey,
    translateSymptomList,
    t
  };
}; 