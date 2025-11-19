# Typography System

This project uses a custom typography system with three main font families:

## Font Families

### 1. Headlines - Space Grotesk (Area Extended Alternative)
- **Font**: Space Grotesk (free alternative to Area Extended)
- **Weight**: 600 (Semibold)
- **Style**: All Caps with letter spacing
- **Usage**: Main headings, titles, and prominent text

### 2. Subheadlines - Montserrat Medium
- **Font**: Montserrat
- **Weight**: 500 (Medium)
- **Usage**: Section headings, subtitles, and secondary headings

### 3. Body Copy - Montserrat Light
- **Font**: Montserrat
- **Weight**: 300 (Light)
- **Usage**: Paragraphs, body text, and general content

## Available Classes

### Typography Scale Classes

#### Headlines (All Caps, Semibold)
```html
<h1 className="text-headline-xl">Extra Large Headline</h1>
<h2 className="text-headline-lg">Large Headline</h2>
<h3 className="text-headline-md">Medium Headline</h3>
<h4 className="text-headline-sm">Small Headline</h4>
```

#### Subheadlines (Medium Weight)
```html
<h2 className="text-subheadline-xl">Extra Large Subheadline</h2>
<h3 className="text-subheadline-lg">Large Subheadline</h3>
<h4 className="text-subheadline-md">Medium Subheadline</h4>
<h5 className="text-subheadline-sm">Small Subheadline</h5>
```

#### Body Copy (Light Weight)
```html
<p className="text-body-xl">Extra Large Body Text</p>
<p className="text-body-lg">Large Body Text</p>
<p className="text-body-md">Medium Body Text</p>
<p className="text-body-sm">Small Body Text</p>
```

### Direct Font Classes
```html
<div className="font-headline">Custom headline text</div>
<div className="font-subheadline">Custom subheadline text</div>
<div className="font-body">Custom body text</div>
```

## Responsive Design

All typography classes include responsive breakpoints:
- **Base**: Mobile sizes
- **lg**: Large screens (1024px+)
- **xl**: Extra large screens (1280px+)

## Character Sets

### Headlines (Space Grotesk - All Caps)
```
A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
1 2 3 4 5 6 7 8 9 0
```

### Subheadlines (Montserrat Medium)
```
A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
a b c d e f g h i j k l m n o p q r s t u v w x y z
1 2 3 4 5 6 7 8 9 0
```

### Body Copy (Montserrat Light)
```
A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
a b c d e f g h i j k l m n o p q r s t u v w x y z
1 2 3 4 5 6 7 8 9 0
```

## Implementation Notes

1. **Font Loading**: Fonts are loaded via Google Fonts in `index.html`
2. **Fallbacks**: Each font family includes system fallbacks
3. **Area Extended**: Currently using Space Grotesk as a free alternative. To use the actual Area Extended font, you'll need to:
   - Purchase the font license
   - Host the font files locally
   - Update the font-family declarations in `tailwind.config.ts` and `src/index.css`

## Demo Component

See `src/components/ui/TypographyDemo.tsx` for a complete demonstration of all typography classes and character sets.

## Configuration Files

- **Font imports**: `index.html`
- **Tailwind config**: `tailwind.config.ts`
- **CSS utilities**: `src/index.css`
- **Demo component**: `src/components/ui/TypographyDemo.tsx`
