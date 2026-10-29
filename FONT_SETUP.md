# Area Extended Font Setup

## Required Font Files

To use Area Extended, you need to place the following font files in the `src/assets/fonts/` directory:

```
src/assets/fonts/
├── AreaExtended-Semibold.woff2
├── AreaExtended-Semibold.woff
├── AreaExtended-Semibold.ttf
├── AreaExtended-Bold.woff2
├── AreaExtended-Bold.woff
└── AreaExtended-Bold.ttf
```

## Font File Sources

Area Extended is a premium font that can be purchased from:
- [Type Network](https://www.typenetwork.com/fonts/area-extended)
- [MyFonts](https://www.myfonts.com/fonts/area/area-extended/)
- [Font Squirrel](https://www.fontsquirrel.com/fonts/area-extended) (if available)

## Implementation

The font has been configured in the project with the following setup:

### 1. Font Face Declarations (src/index.css)
```css
@font-face {
  font-family: 'Area Extended';
  src: url('./assets/fonts/AreaExtended-Semibold.woff2') format('woff2'),
       url('./assets/fonts/AreaExtended-Semibold.woff') format('woff'),
       url('./assets/fonts/AreaExtended-Semibold.ttf') format('truetype');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
```

### 2. Tailwind Configuration (tailwind.config.ts)
```typescript
fontFamily: {
  'headline': ['Area Extended', 'Space Grotesk', 'system-ui', 'sans-serif'],
  'area-extended': ['Area Extended', 'Space Grotesk', 'system-ui', 'sans-serif'],
}
```

### 3. CSS Utilities (src/index.css)
```css
.font-headline {
  font-family: 'Area Extended', 'Space Grotesk', system-ui, sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.font-area-extended {
  font-family: 'Area Extended', 'Space Grotesk', system-ui, sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

## Usage in Components

### Using Tailwind Classes
```html
<h1 className="font-area-extended text-4xl">Your Text</h1>
<h2 className="font-headline text-3xl">Your Text</h2>
```

### Using CSS Classes
```html
<div className="font-area-extended">Your Text</div>
```

## Fallbacks

The configuration includes fallbacks:
1. **Area Extended** (primary)
2. **Space Grotesk** (secondary - similar style)
3. **system-ui** (system font)
4. **sans-serif** (generic fallback)

## Font Weights Available

- **600 (Semibold)**: For headlines and important text
- **700 (Bold)**: For emphasis (if you add the bold variant)

## License Requirements

⚠️ **Important**: Make sure you have the proper license for Area Extended before using it in your project. Check the licensing terms from your font provider.

## Alternative (Free)

If you don't have access to Area Extended, the current setup will fall back to Space Grotesk, which is a free alternative with similar characteristics.
