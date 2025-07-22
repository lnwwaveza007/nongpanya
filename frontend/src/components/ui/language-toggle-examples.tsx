import LanguageToggle from "./language-toggle";

// Example component showing different ways to use LanguageToggle
export const LanguageToggleExamples = () => {
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-semibold">Language Toggle Examples</h2>
      
      {/* Floating variant (like login page) */}
      <div className="relative border p-4 rounded-lg">
        <h3 className="font-medium mb-2">Floating Variant</h3>
        <p className="text-sm text-gray-600 mb-4">Fixed position in top-right corner</p>
        <LanguageToggle variant="floating" />
      </div>

      {/* Inline variant */}
      <div className="border p-4 rounded-lg">
        <h3 className="font-medium mb-2">Inline Variant</h3>
        <p className="text-sm text-gray-600 mb-4">Fits naturally in content flow</p>
        <div className="flex items-center gap-2">
          <span>Language:</span>
          <LanguageToggle variant="inline" />
        </div>
      </div>

      {/* Different sizes */}
      <div className="border p-4 rounded-lg">
        <h3 className="font-medium mb-2">Different Sizes</h3>
        <p className="text-sm text-gray-600 mb-4">Small, default, and large sizes</p>
        <div className="flex items-center gap-2">
          <LanguageToggle size="sm" />
          <LanguageToggle size="default" />
          <LanguageToggle size="lg" />
        </div>
      </div>

      {/* Icon only */}
      <div className="border p-4 rounded-lg">
        <h3 className="font-medium mb-2">Icon Only</h3>
        <p className="text-sm text-gray-600 mb-4">Just the globe icon</p>
        <LanguageToggle showText={false} />
      </div>

      {/* Text only */}
      <div className="border p-4 rounded-lg">
        <h3 className="font-medium mb-2">Text Only</h3>
        <p className="text-sm text-gray-600 mb-4">Just the language text</p>
        <LanguageToggle showIcon={false} />
      </div>

      {/* Custom styling */}
      <div className="border p-4 rounded-lg">
        <h3 className="font-medium mb-2">Custom Styling</h3>
        <p className="text-sm text-gray-600 mb-4">With custom className</p>
        <LanguageToggle 
          className="bg-blue-500 text-white hover:bg-blue-600 border-blue-500" 
        />
      </div>
    </div>
  );
}; 