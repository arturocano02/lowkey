# Lowkey Landing Page

A production-ready Next.js landing page for Lowkey, a drop-style streetwear label.

## Features

- **Next.js 14+** with App Router and TypeScript
- **Tailwind CSS** for styling
- **Interactive Spotlight Effect** that follows cursor/touch with smooth animations
- **Responsive Design** optimized for desktop and mobile
- **Email Form** with validation and success states
- **Accessibility** compliant with WCAG AA standards
- **SEO Optimized** with proper metadata
- **Performance Optimized** with GPU-friendly CSS masks

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

The project includes `vercel.json` configuration for optimal deployment.

### Manual Deployment

```bash
npm run build
npm start
```

## Technical Details

### Spotlight Effect

The interactive spotlight effect uses:
- CSS `mask-image` with `radial-gradient` for GPU-accelerated rendering
- CSS custom properties (`--mx`, `--my`, `--radius`) for smooth updates
- `requestAnimationFrame` with linear interpolation for smooth cursor following
- Responsive radius: 200px desktop, 120px mobile

### Performance Optimizations

- Passive event listeners for better scroll performance
- CSS masks instead of canvas for GPU acceleration
- Optimized image loading with Next.js Image component
- Minimal JavaScript for maximum performance

### Accessibility

- WCAG AA contrast ratios
- Focus-visible rings on interactive elements
- ARIA labels on form inputs and buttons
- Keyboard navigation support
- Screen reader friendly

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Main landing page
│   └── globals.css     # Global styles
public/
├── background.jpg      # Hero background image
└── ...
```

## Browser Support

- Chrome 88+
- Firefox 87+
- Safari 14+
- Edge 88+

## License

Private - Lowkey Brand