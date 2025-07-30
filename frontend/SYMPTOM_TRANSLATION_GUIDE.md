# Symptom Translation System Guide

## Overview

This system allows you to translate symptoms that are stored in the database from English to other languages (currently Thai) using i18n integration.

## How It Works

### 1. Database Storage
- Symptoms are stored in the database with English names
- Example: `"Diarrhea"`, `"Headache"`, `"Back/Shoulder/Muscle/Joint Pain"`

### 2. Translation Mapping
- `frontend/src/utils/symptomTranslations.ts` maps database names to translation keys
- Example: `"Diarrhea"` → `"symptoms.diarrhea"`

### 3. i18n Integration
- Translation keys are defined in `frontend/locales/en/translactions.json` and `frontend/locales/th/translactions.json`
- When language changes, symptoms automatically update

## Files Structure

```
frontend/
├── src/
│   ├── utils/
│   │   └── symptomTranslations.ts          # Translation mapping
│   ├── hooks/
│   │   └── useSymptomTranslation.tsx       # Custom hook for translations
│   ├── components/
│   │   ├── form/
│   │   │   └── CustomCheckbox.tsx          # Updated to use translations
│   │   └── ui/
│   │       └── symptom-translation-demo.tsx # Demo component
│   └── locales/
│       ├── en/
│       │   └── translactions.json          # English translations
│       └── th/
│           └── translactions.json          # Thai translations
```

## Usage Examples

### Basic Usage

```tsx
import { useSymptomTranslation } from '@/hooks/useSymptomTranslation';

const MyComponent = () => {
  const { translateSymptom } = useSymptomTranslation();
  
  return (
    <div>
      <p>Translated: {translateSymptom('Diarrhea')}</p>
      {/* Output: "ท้องเสีย" (in Thai) or "Diarrhea" (in English) */}
    </div>
  );
};
```

### Translating Symptom Lists

```tsx
import { useSymptomTranslation } from '@/hooks/useSymptomTranslation';

const MyComponent = () => {
  const { translateSymptomList } = useSymptomTranslation();
  
  const symptoms = [
    { id: '1', name: 'Headache', icon: '🤕' },
    { id: '2', name: 'Fever', icon: '🤒' },
  ];
  
  const translatedSymptoms = translateSymptomList(symptoms);
  
  return (
    <div>
      {translatedSymptoms.map(symptom => (
        <div key={symptom.id}>
          {symptom.icon} {symptom.translatedName}
        </div>
      ))}
    </div>
  );
};
```

### Direct Utility Usage

```tsx
import { getTranslatedSymptomName } from '@/utils/symptomTranslations';
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  const translatedName = getTranslatedSymptomName('Muscle Pain', t);
  
  return <div>{translatedName}</div>;
};
```

## Adding New Symptoms

### 1. Add to Database
```sql
INSERT INTO symptoms (name, description) 
VALUES ('New Symptom', 'Description here');
```

### 2. Add Translation Mapping
In `frontend/src/utils/symptomTranslations.ts`:
```typescript
export const symptomTranslationMap: Record<string, string> = {
  // ... existing mappings
  'New Symptom': 'symptoms.newSymptom',
};
```

### 3. Add Translations
In `frontend/locales/en/translactions.json`:
```json
{
  "symptoms": {
    // ... existing translations
    "newSymptom": "New Symptom"
  }
}
```

In `frontend/locales/th/translactions.json`:
```json
{
  "symptoms": {
    // ... existing translations
    "newSymptom": "อาการใหม่"
  }
}
```

## Current Symptom Translations

| Database Name | English | Thai |
|---------------|---------|------|
| Diarrhea | Diarrhea | ท้องเสีย |
| Bloating | Bloating | ท้องอืด |
| Headache | Headache | ปวดหัว |
| Fever | Fever | ไข้ |
| Toothache | Toothache | ปวดฟัน |
| Menstrual Pain | Menstrual Pain | ปวดประจำเดือน |
| Back/Shoulder/Muscle/Joint Pain | Back/Shoulder/Muscle/Joint Pain | ปวดหลัง/ไหล่/กล้ามเนื้อ/ข้อต่อ |
| Muscle Pain | Muscle Pain | ปวดกล้ามเนื้อ |
| Tremors (Parkinson's Disease) | Tremors (Parkinson's Disease) | สั่น (โรคพาร์กินสัน) |
| Smalll Wound | Smalll Wound | แผลเล็ก

## Benefits

1. **No Database Changes**: Symptoms remain in English in the database
2. **Easy Maintenance**: Add new symptoms by updating translation files
3. **Automatic Updates**: Symptoms update when language changes
4. **Fallback Support**: Shows original name if translation not found
5. **Type Safety**: TypeScript support for translation keys
6. **Reusable**: Can be used anywhere in the application

## Testing

Use the `SymptomTranslationDemo` component to test translations:

```tsx
import { SymptomTranslationDemo } from '@/components/ui/symptom-translation-demo';

// Add to any page to see the demo
<SymptomTranslationDemo />
```

## Troubleshooting

### Symptom Not Translating
1. Check if the symptom name exists in `symptomTranslationMap`
2. Verify translation keys exist in both language files
3. Ensure the symptom name matches exactly (case-sensitive)

### Translation Key Not Found
- The system will fallback to the original database name
- Check console for warnings about missing translation keys

### Performance
- Translations are cached by i18n
- No performance impact on language switching
- Translation mapping is static and fast 