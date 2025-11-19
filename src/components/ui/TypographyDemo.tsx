import React from 'react';

const TypographyDemo: React.FC = () => {
  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-headline-lg">Typography System Demo</h2>
        <p className="text-body-md">
          This component demonstrates the configured font families and typography scale.
        </p>
      </div>

      {/* Headlines */}
      <section className="space-y-4">
        <h3 className="text-subheadline-md text-gray-600">Headlines (Area Extended Alternative - Space Grotesk)</h3>
        <div className="space-y-2">
          <h1 className="text-headline-xl">Headline Extra Large</h1>
          <h2 className="text-headline-lg">Headline Large</h2>
          <h3 className="text-headline-md">Headline Medium</h3>
          <h4 className="text-headline-sm">Headline Small</h4>
        </div>
        <p className="text-body-sm text-gray-500">
          Font: Space Grotesk (Area Extended alternative) | Weight: 600 (Semibold) | Style: All Caps
        </p>
      </section>

      {/* Subheadlines */}
      <section className="space-y-4">
        <h3 className="text-subheadline-md text-gray-600">Subheadlines (Montserrat)</h3>
        <div className="space-y-2">
          <h2 className="text-subheadline-xl">Subheadline Extra Large</h2>
          <h3 className="text-subheadline-lg">Subheadline Large</h3>
          <h4 className="text-subheadline-md">Subheadline Medium</h4>
          <h5 className="text-subheadline-sm">Subheadline Small</h5>
        </div>
        <p className="text-body-sm text-gray-500">
          Font: Montserrat | Weight: 500 (Medium)
        </p>
      </section>

      {/* Body Copy */}
      <section className="space-y-4">
        <h3 className="text-subheadline-md text-gray-600">Body Copy (Montserrat)</h3>
        <div className="space-y-2">
          <p className="text-body-xl">
            This is extra large body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p className="text-body-lg">
            This is large body text. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
            laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className="text-body-md">
            This is medium body text. Duis aute irure dolor in reprehenderit in voluptate velit 
            esse cillum dolore eu fugiat nulla pariatur.
          </p>
          <p className="text-body-sm">
            This is small body text. Excepteur sint occaecat cupidatat non proident, sunt in 
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <p className="text-body-sm text-gray-500">
          Font: Montserrat | Weight: 300 (Light)
        </p>
      </section>

      {/* Font Character Sets */}
      <section className="space-y-4">
        <h3 className="text-subheadline-md text-gray-600">Font Character Sets</h3>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-subheadline-sm mb-2">Headline Characters (Space Grotesk - All Caps)</h4>
            <p className="font-headline text-2xl">
              A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
            </p>
            <p className="font-headline text-2xl">
              1 2 3 4 5 6 7 8 9 0
            </p>
          </div>

          <div>
            <h4 className="text-subheadline-sm mb-2">Subheadline Characters (Montserrat Medium)</h4>
            <p className="font-subheadline text-xl">
              A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
            </p>
            <p className="font-subheadline text-xl">
              a b c d e f g h i j k l m n o p q r s t u v w x y z
            </p>
            <p className="font-subheadline text-xl">
              1 2 3 4 5 6 7 8 9 0
            </p>
          </div>

          <div>
            <h4 className="text-subheadline-sm mb-2">Body Copy Characters (Montserrat Light)</h4>
            <p className="font-body text-lg">
              A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
            </p>
            <p className="font-body text-lg">
              a b c d e f g h i j k l m n o p q r s t u v w x y z
            </p>
            <p className="font-body text-lg">
              1 2 3 4 5 6 7 8 9 0
            </p>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="space-y-4">
        <h3 className="text-subheadline-md text-gray-600">Usage Examples</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
{`// Headlines (All Caps, Semibold)
<h1 className="text-headline-xl">Main Page Title</h1>
<h2 className="text-headline-lg">Section Title</h2>

// Subheadlines (Medium Weight)
<h3 className="text-subheadline-md">Subsection</h3>

// Body Copy (Light Weight)
<p className="text-body-md">Regular paragraph text</p>
<span className="text-body-sm">Small text or captions</span>

// Direct Font Classes
<div className="font-headline">Custom headline text</div>
<div className="font-subheadline">Custom subheadline text</div>
<div className="font-body">Custom body text</div>`}
          </pre>
        </div>
      </section>
    </div>
  );
};

export default TypographyDemo;
