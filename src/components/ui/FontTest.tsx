import React from 'react';

const FontTest: React.FC = () => {
  return (
    <div className="p-8 bg-white">
      <h2 className="text-subheadline-lg mb-6 text-gray-700">Area Extended Font Test</h2>
      
      <div className="space-y-6">
        {/* Current Implementation */}
        <div className="border p-4 rounded-lg">
          <h3 className="text-subheadline-sm mb-2 text-gray-600">Current Implementation (with fallbacks)</h3>
          <div className="font-area-extended text-[45px] text-[#3A3B40] leading-relaxed">
            The Refined Report
          </div>
          <div className="font-area-extended text-[24px] text-gray-700 mt-2 tracking-wider">
            MARK MENENDEZ
          </div>
        </div>

        {/* Alternative with Inter */}
        <div className="border p-4 rounded-lg">
          <h3 className="text-subheadline-sm mb-2 text-gray-600">Alternative with Inter (similar to Area Extended)</h3>
          <div className="font-area-extended-alt text-[45px] text-[#3A3B40] leading-relaxed">
            The Refined Report
          </div>
          <div className="font-area-extended-alt text-[24px] text-gray-700 mt-2 tracking-wider">
            MARK MENENDEZ
          </div>
        </div>

        {/* Character Set Test */}
        <div className="border p-4 rounded-lg">
          <h3 className="text-subheadline-sm mb-2 text-gray-600">Character Set Test</h3>
          <div className="font-area-extended text-lg text-gray-700">
            <div className="mb-2">A B C D E F G H I J K L M N O P Q R S T U V W X Y Z</div>
            <div className="mb-2">a b c d e f g h i j k l m n o p q r s t u v w x y z</div>
            <div>1 2 3 4 5 6 7 8 9 0</div>
          </div>
        </div>

        {/* Font Information */}
        <div className="border p-4 rounded-lg bg-gray-50">
          <h3 className="text-subheadline-sm mb-2 text-gray-600">Font Information</h3>
          <div className="text-body-sm text-gray-600 space-y-1">
            <p><strong>Primary:</strong> Area Extended (if font files are available)</p>
            <p><strong>Fallback 1:</strong> Inter (similar characteristics)</p>
            <p><strong>Fallback 2:</strong> Space Grotesk</p>
            <p><strong>Fallback 3:</strong> system-ui</p>
            <p><strong>Fallback 4:</strong> sans-serif</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontTest;
