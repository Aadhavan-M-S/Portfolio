# Portfolio

A modern, production-ready portfolio website built with React and Vite. Features include smooth animations, magnetic buttons, canvas particle effects, and a clean dark/light mode design.

## Design Philosophy

This portfolio follows modern SaaS design principles:

- **Dark-first aesthetic**: Professional dark theme with optional light mode support
- **Modern animations**: Reveal on scroll, magnetic effects, smooth transitions
- **Modular architecture**: Reusable components, custom hooks, organized data layer
- **Performance-focused**: Optimized animations, lazy effects, reduced motion support
- **Content-driven**: All content sourced from structured data files

## Tech Stack

- React 18.3.1
- Vite 5.4.8
- Custom CSS with CSS Variables
- Canvas API for particle effects
- Intersection Observer for scroll reveals

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project Structure

```
src/
  components/
    Nav.jsx, Nav.css              # Fixed navigation with active section detection
    ScrollProgress.jsx, .css      # Scroll depth indicator
    SectionHeading.jsx, .css      # Reusable section headings
    ProjectCard.jsx, .css         # Expandable project cards
    HeroGraphic.jsx, .css         # Canvas particle animation
    MagneticButton.jsx            # Button with magnetic hover effect
    Reveal.jsx                    # Scroll reveal wrapper
    Footer.jsx, Footer.css        # Footer with social links
    
  sections/
    Hero.jsx, Hero.css            # Landing with animated background
    About.jsx, About.css          # Background and expertise areas
    Projects.jsx, Projects.css    # Project case studies
    Skills.jsx, Skills.css        # Grouped technology list
    Contact.jsx, Contact.css      # Contact information with CTAs
    
  data/
    profile.js                    # Personal information and links
    about.js                      # About section content
    projects.js                   # Project data with full details
    skills.js                     # Categorized skill groups
    techstack.js                  # Technologies for marquee
    
  hooks/
    useReveal.js                  # Intersection Observer for reveals
    useMagnetic.js                # Magnetic button effect
    useScrollDepth.js             # Scroll depth calculation
    useActiveSection.js           # Active section detection
    
  styles/
    variables.css                 # Design tokens and CSS variables
    base.css                      # Reset and base styles
    layout.css                    # Layout utilities
    animations.css                # Keyframes and animation classes
    buttons.css                   # Button variants
    
  App.jsx                         # Main app component
  main.jsx                        # React entry point
```

## Features

- **Animated particle background**: Canvas-based particle system with connections
- **Magnetic buttons**: Buttons that follow mouse movement on hover
- **Scroll reveals**: Sections fade in as you scroll with staggered animations
- **Scroll progress indicator**: Visual feedback showing page scroll depth
- **Active section tracking**: Navigation updates based on visible section
- **Expandable project cards**: Click to reveal full project details
- **Responsive design**: Optimized for all screen sizes
- **Accessibility**: Keyboard navigation, ARIA labels, reduced motion support
- **Dark/Light mode**: Automatic based on system preference
- **Performance optimized**: Lazy effects, efficient animations

## Design Decisions

### Color System
Dark theme with blue accent (#3b82f6). Carefully chosen opacity levels for depth without visual clutter.

### Typography
System fonts for performance. Fluid scaling using clamp() and responsive font sizes. Display font weight (800) for impact.

### Animations
- Reveal on scroll with Intersection Observer
- Magnetic effect on buttons using mousemove
- Canvas particles for visual interest
- CSS-based transitions for performance

### Component Architecture
- Custom hooks for reusable logic
- Data-driven content from separate files
- CSS Modules pattern (component-specific stylesheets)
- Utility classes for layout

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

This portfolio is a personal project. Content and code structure can be referenced, but please create your own content and design.
