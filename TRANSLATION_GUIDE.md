# Nongpanya Translation Guide

## Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Translation System](#translation-system)
4. [File Organization](#file-organization)
5. [Adding New Translations](#adding-new-translations)
6. [Translation Best Practices](#translation-best-practices)
7. [Common Patterns](#common-patterns)
8. [Testing Translations](#testing-translations)
9. [Troubleshooting](#troubleshooting)
10. [Contributing Guidelines](#contributing-guidelines)

## Overview

Nongpanya is a multilingual medical assistant application that supports English (en) and Thai (th) languages. The translation system uses **react-i18next** for internationalization and follows a structured approach to maintain consistency across the application.

### Supported Languages
- **English (en)**: Primary language, used as fallback
- **Thai (th)**: Secondary language, default display language

## Project Structure

```
frontend/
├── locales/                          # Translation files
│   ├── en/
│   │   └── translactions.json        # English translations
│   └── th/
│       └── translactions.json        # Thai translations
├── src/
│   ├── i18n.tsx                      # i18n configuration
│   ├── utils/
│   │   └── symptomTranslations.ts    # Symptom translation mapping
│   └── hooks/
│       └── useSymptomTranslation.tsx # Custom translation hook
└── SYMPTOM_TRANSLATION_GUIDE.md      # Symptom-specific guide
```

## Translation System

### Core Components

1. **i18n Configuration** (`src/i18n.tsx`)
   - Sets up react-i18next with English and Thai resources
   - Default language: Thai (`th`)
   - Fallback language: English (`en`)

2. **Translation Files** (`locales/`)
   - JSON format for easy maintenance
   - Nested structure for organized translations
   - Consistent key naming conventions

3. **Symptom Translation System**
   - Special handling for medical symptoms
   - Database stores English names
   - Dynamic translation based on user language preference

## File Organization

### Translation File Structure

Translations are organized in a hierarchical structure:

```json
{
  "section": {
    "subsection": {
      "key": "value",
      "nested": {
        "deepKey": "deep value"
      }
    }
  }
}
```

### Current Sections

1. **welcome**: Welcome screen messages
2. **login**: Authentication-related text
3. **dashboard**: Admin dashboard interface
4. **form**: User input form elements
5. **result**: Results and medication information
6. **screen**: Kiosk screen interface
7. **loading**: Loading states and error messages
8. **homepage**: Main user interface
9. **medicineModal**: Medicine information popups
10. **userLog**: User activity logs
11. **symptoms**: Medical symptom translations
12. **detail**: Detailed medical instructions
13. **medicineDescription**: Medicine descriptions

## Adding New Translations

### Step 1: Identify the Translation Context

Before adding translations, determine:
- Which component/page needs translation
- What section the translation belongs to
- Whether it's a new section or existing one

### Step 2: Choose the Translation Key

Follow the naming convention:
- Use camelCase for keys
- Be descriptive but concise
- Group related translations under the same section

**Examples:**
```json
{
  "form": {
    "newField": "New Field Label",
    "newFieldPlaceholder": "Enter new field value"
  }
}
```

### Step 3: Add to Both Language Files

**English (`locales/en/translactions.json`):**
```json
{
  "existingSection": {
    "existingKey": "existing value",
    "newKey": "New English text"
  }
}
```

**Thai (`locales/th/translactions.json`):**
```json
{
  "existingSection": {
    "existingKey": "existing value",
    "newKey": "ข้อความภาษาไทยใหม่"
  }
}
```

### Step 4: Use in Components

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('existingSection.newKey')}</h1>
    </div>
  );
};
```

## Translation Best Practices

### 1. Key Naming Conventions

- **Use descriptive names**: `submitButton` instead of `btn`
- **Group related items**: All form elements under `form` section
- **Be consistent**: Use the same pattern across similar elements
- **Avoid abbreviations**: Use full words for clarity

### 2. Text Content Guidelines

- **Keep it concise**: Avoid overly long translations
- **Maintain context**: Ensure translations fit the UI context
- **Use proper grammar**: Follow language-specific grammar rules
- **Consider cultural differences**: Adapt content for local audiences

### 3. Medical Terminology

- **Be accurate**: Medical terms must be precise
- **Use official terms**: Follow medical terminology standards
- **Provide context**: Include necessary medical context
- **Consider readability**: Balance technical accuracy with user understanding

### 4. Pluralization and Variables

For dynamic content, use i18n interpolation:

```json
{
  "welcome": {
    "greeting": "Hello {{name}}!",
    "itemsCount": "{{count}} items found"
  }
}
```

```tsx
const { t } = useTranslation();
return (
  <div>
    {t('welcome.greeting', { name: userName })}
    {t('welcome.itemsCount', { count: itemCount })}
  </div>
);
```

## Common Patterns

### 1. Form Elements

```json
{
  "form": {
    "fieldName": "Field Label",
    "fieldNamePlaceholder": "Placeholder text",
    "fieldNameError": "Error message",
    "fieldNameHelp": "Help text"
  }
}
```

### 2. Button Actions

```json
{
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "add": "Add",
    "submit": "Submit"
  }
}
```

### 3. Status Messages

```json
{
  "status": {
    "loading": "Loading...",
    "success": "Success!",
    "error": "An error occurred",
    "warning": "Warning"
  }
}
```

### 4. Error Messages

```json
{
  "errors": {
    "required": "This field is required",
    "invalid": "Invalid input",
    "network": "Network error",
    "server": "Server error"
  }
}
```

## Testing Translations

### 1. Manual Testing

1. **Switch languages**: Test both English and Thai
2. **Check all pages**: Ensure translations appear correctly
3. **Verify context**: Confirm translations fit the UI
4. **Test edge cases**: Empty states, error messages, etc.

### 2. Language Switching

```tsx
import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('th')}>ไทย</button>
    </div>
  );
};
```

### 3. Translation Validation

Check for:
- Missing translations (fallback to English)
- Inconsistent formatting
- Text overflow in UI components
- Proper grammar and spelling

## Troubleshooting

### Common Issues

1. **Translation not appearing**
   - Check if the key exists in both language files
   - Verify the key path is correct
   - Ensure the component is using `useTranslation()`

2. **Fallback to English**
   - Missing translation in Thai file
   - Incorrect key name
   - Syntax error in JSON file

3. **Text overflow**
   - Thai text is often longer than English
   - Adjust UI components to accommodate longer text
   - Consider using shorter translations

4. **Inconsistent translations**
   - Use the same terminology across similar contexts
   - Maintain a glossary of common terms
   - Review existing translations for consistency

### Debugging Tips

1. **Enable i18n debug mode**:
```tsx
i18next.init({
  debug: true,
  // ... other options
});
```

2. **Check console for missing keys**:
   - Missing translations will show warnings in console
   - Use these warnings to identify missing translations

3. **Validate JSON syntax**:
   - Use a JSON validator to check for syntax errors
   - Ensure proper comma placement and bracket matching

## Contributing Guidelines

### Before Contributing

1. **Review existing translations**: Understand the current patterns
2. **Check the glossary**: Use consistent terminology
3. **Test your changes**: Verify translations work correctly
4. **Follow the style guide**: Maintain consistency

### Pull Request Checklist

- [ ] Added translations to both English and Thai files
- [ ] Used consistent key naming conventions
- [ ] Tested language switching
- [ ] Verified translations fit the UI context
- [ ] Checked for grammar and spelling errors
- [ ] Updated documentation if needed

### Translation Review Process

1. **Self-review**: Check your own translations
2. **Peer review**: Have another contributor review
3. **Native speaker review**: If possible, have a native speaker verify
4. **UI testing**: Ensure translations work in the interface

### Medical Content Guidelines

- **Accuracy first**: Medical translations must be precise
- **Professional tone**: Maintain appropriate medical terminology
- **Safety information**: Ensure warnings and instructions are clear
- **Cultural sensitivity**: Consider local medical practices and beliefs

## Resources

### Documentation
- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)
- [SYMPTOM_TRANSLATION_GUIDE.md](./SYMPTOM_TRANSLATION_GUIDE.md)

### Tools
- JSON validators for syntax checking
- Translation memory tools for consistency
- Medical terminology databases

### Contacts
- For medical terminology questions, consult with healthcare professionals
- For technical issues, refer to the development team
- For cultural context, consult with native speakers

---

**Note**: This guide is a living document. Please update it as the translation system evolves or new patterns emerge. 