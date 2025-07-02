# ECU Admin Panel - Cursor Rules & Design System

## 🎨 Design Philosophy

Modern, minimalist, profesyonel ve fonksiyonel bir tasarım dili. Minimum gradient kullanımı ile temiz ve kontrast odaklı bir görsel dil.

## 🎨 Color Palette

### Primary Colors
```css
/* Pistachio Green - Ana Yeşil */
--color-pistachio: #93C572;
--color-pistachio-light: #B8E994;
--color-pistachio-dark: #6B9552;

/* Bright Orange - Parlak Turuncu */
--color-orange: #FF8C42;
--color-orange-light: #FFB380;
--color-orange-dark: #E06820;

/* Light Purple - Açık Mor */
--color-purple: #9B72CF;
--color-purple-light: #C5A3E8;
--color-purple-dark: #7A5BA8;

/* Neutral Colors - Nötr Renkler */
--color-white: #FFFFFF;
--color-black: #000000;
--color-gray-50: #FAFAFA;
--color-gray-100: #F5F5F5;
--color-gray-200: #E5E5E5;
--color-gray-300: #D4D4D4;
--color-gray-400: #A3A3A3;
--color-gray-500: #737373;
--color-gray-600: #525252;
--color-gray-700: #404040;
--color-gray-800: #262626;
--color-gray-900: #171717;
```

## 🎯 Design Principles

### 1. Minimal Gradient Usage
- Gradient kullanımı sadece vurgu için
- Ana elementlerde düz renkler
- Hover efektlerinde subtle gradient geçişleri

### 2. High Contrast
- Açık tema: Beyaz zemin üzerine koyu metin
- Koyu tema: Siyah zemin üzerine açık metin
- WCAG AA standartlarına uygun kontrast oranları

### 3. Consistent Spacing
```css
/* Spacing Scale */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

## 🧩 Component Patterns

### Cards & Containers
```tsx
// Primary Card - Düz renk, keskin köşeler
<Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">

// Accent Card - Renkli vurgu
<Card className="bg-pistachio-50 dark:bg-pistachio-900/10 border border-pistachio-200 dark:border-pistachio-800">

// Hover Card - Subtle lift effect
<Card className="hover:-translate-y-0.5 transition-transform duration-200">
```

### Buttons
```tsx
// Primary Button - Pistachio
<Button className="bg-pistachio-600 hover:bg-pistachio-700 text-white font-medium shadow-sm hover:shadow transition-all duration-200">

// Secondary Button - Orange
<Button className="bg-orange-600 hover:bg-orange-700 text-white font-medium shadow-sm hover:shadow transition-all duration-200">

// Tertiary Button - Purple
<Button className="bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-sm hover:shadow transition-all duration-200">

// Ghost Button
<Button className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">

// Outline Button
<Button className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50">
```

### Typography
```tsx
// Headings
<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
<h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
<h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
<h4 className="text-lg font-medium text-gray-700 dark:text-gray-300">

// Body Text
<p className="text-gray-600 dark:text-gray-400 leading-relaxed">
<p className="text-sm text-gray-500 dark:text-gray-500">

// Accent Text
<span className="text-pistachio-600 dark:text-pistachio-400 font-medium">
<span className="text-orange-600 dark:text-orange-400 font-medium">
<span className="text-purple-600 dark:text-purple-400 font-medium">
```

### Icons
```tsx
// Icon Container - Colored Background
<div className="p-2 bg-pistachio-100 dark:bg-pistachio-900/20 rounded-lg">
  <Icon className="h-5 w-5 text-pistachio-600 dark:text-pistachio-400" />
</div>

// Icon with Text
<div className="flex items-center gap-2">
  <Icon className="h-4 w-4 text-gray-500" />
  <span className="text-sm text-gray-600 dark:text-gray-400">Label</span>
</div>
```

### Tables
```tsx
// Table Header
<TableHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">

// Table Row
<TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">

// Table Cell
<TableCell className="text-gray-700 dark:text-gray-300">
```

### Forms
```tsx
// Input Field
<Input className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-pistachio-500 focus:ring-pistachio-500/20">

// Select
<Select className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">

// Checkbox/Radio
<Checkbox className="text-pistachio-600 focus:ring-pistachio-500/20">
```

### Badges & Tags
```tsx
// Status Badges
<Badge className="bg-pistachio-100 text-pistachio-800 dark:bg-pistachio-900/20 dark:text-pistachio-300">
<Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
<Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">

// Neutral Badge
<Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
```

## 📐 Layout Patterns

### Admin Layout Structure
```tsx
// Main Container
<div className="flex h-screen bg-gray-50 dark:bg-gray-900">
  
  // Sidebar
  <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
  
  // Content Area
  <main className="flex-1 bg-gray-50 dark:bg-gray-900">
    
    // Header
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16">
    
    // Page Content
    <div className="p-6 lg:p-8">
```

### Grid Layouts
```tsx
// Stats Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

// Content Grid
<div className="grid grid-cols-12 gap-6">
  <div className="col-span-12 lg:col-span-8">
  <div className="col-span-12 lg:col-span-4">
```

## 🎭 Animation & Transitions

### Standard Transitions
```css
/* Fast - UI feedback */
transition-all duration-150

/* Normal - Default */
transition-all duration-200

/* Slow - Smooth animations */
transition-all duration-300
```

### Hover Effects
```css
/* Lift Effect */
hover:-translate-y-0.5

/* Scale Effect */
hover:scale-105

/* Shadow Effect */
hover:shadow-md

/* Color Transition */
hover:bg-gray-100 dark:hover:bg-gray-800
```

## 🔧 Utility Classes

### Shadows
```css
/* Subtle */
shadow-sm

/* Default */
shadow

/* Medium */
shadow-md

/* Large */
shadow-lg

/* Extra Large */
shadow-xl
```

### Border Radius
```css
/* Small */
rounded

/* Medium */
rounded-lg

/* Large */
rounded-xl

/* Extra Large */
rounded-2xl
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large screens */
2xl: 1536px /* Extra large screens */
```

### Responsive Patterns
```tsx
// Text Size
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Padding
<div className="p-4 md:p-6 lg:p-8">

// Grid Columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## 🎯 Best Practices

1. **Color Usage**
   - Primary actions: Pistachio green
   - Secondary actions: Orange
   - Tertiary/Special: Purple
   - Destructive: Red (sparingly)
   - Neutral: Grays

2. **Icon Usage**
   - Always use Lucide React icons
   - Consistent sizing: h-4 w-4 (small), h-5 w-5 (default), h-6 w-6 (large)
   - Add descriptive aria-labels

3. **Spacing**
   - Use consistent spacing scale
   - Group related items with smaller gaps
   - Separate sections with larger gaps

4. **Typography**
   - Clear hierarchy with size and weight
   - High contrast for readability
   - Consistent line heights

5. **Interactive Elements**
   - Clear hover states
   - Focus indicators for accessibility
   - Smooth transitions

## 🚫 What to Avoid

1. **No excessive gradients** - Only subtle gradients for special emphasis
2. **No drop shadows on text** - Use color contrast instead
3. **No excessive animations** - Keep it subtle and functional
4. **No custom colors outside palette** - Stick to defined colors
5. **No inline styles** - Use Tailwind classes only

## 📋 Component Examples

### Dashboard Card
```tsx
<Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
  <CardHeader className="border-b border-gray-100 dark:border-gray-800">
    <div className="flex items-center justify-between">
      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Title
      </CardTitle>
      <div className="p-2 bg-pistachio-100 dark:bg-pistachio-900/20 rounded-lg">
        <Icon className="h-4 w-4 text-pistachio-600 dark:text-pistachio-400" />
      </div>
    </div>
  </CardHeader>
  <CardContent className="pt-6">
    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
      1,234
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
      Description text
    </p>
  </CardContent>
</Card>
```

### Data Table Row
```tsx
<TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
  <TableCell className="font-medium text-gray-900 dark:text-gray-100">
    Name
  </TableCell>
  <TableCell className="text-gray-600 dark:text-gray-400">
    Description
  </TableCell>
  <TableCell>
    <Badge className="bg-pistachio-100 text-pistachio-800 dark:bg-pistachio-900/20 dark:text-pistachio-300">
      Active
    </Badge>
  </TableCell>
  <TableCell className="text-right">
    <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-800">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </TableCell>
</TableRow>
```

### Form Field
```tsx
<div className="space-y-2">
  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
    Field Label
  </Label>
  <Input 
    className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-pistachio-500 focus:ring-2 focus:ring-pistachio-500/20"
    placeholder="Enter value..."
  />
  <p className="text-xs text-gray-500 dark:text-gray-500">
    Helper text goes here
  </p>
</div>
```

## 🎨 Theme Implementation

### Light Theme
- Background: White/Gray-50
- Text: Gray-900/Gray-800
- Borders: Gray-200/Gray-300
- Hover: Gray-100

### Dark Theme
- Background: Gray-900/Gray-800
- Text: Gray-100/Gray-200
- Borders: Gray-700/Gray-800
- Hover: Gray-800

## 📝 Notes

- Always test components in both light and dark themes
- Ensure sufficient color contrast for accessibility
- Keep animations subtle and purposeful
- Use semantic HTML elements
- Follow mobile-first responsive design
- Test with keyboard navigation 