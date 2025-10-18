# Design Guidelines: Cozy Shared Notes PWA

## Design Approach
**Reference-Based with Custom Aesthetic**: Drawing inspiration from Google Keep's card-based note organization and Notion's clean interface, but with a distinctly cozy, pastel-focused visual identity. The design prioritizes warmth and comfort while maintaining productivity-focused functionality.

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary Background: 28 25% 97% (soft warm white)
- Secondary Background: 330 40% 95% (blush pink tint)
- Card Backgrounds: Pastel variants - 350 60% 92% (soft pink), 200 50% 90% (powder blue), 280 45% 92% (lavender), 140 45% 90% (mint green), 45 55% 90% (peachy cream)
- Text Primary: 240 8% 25% (warm charcoal)
- Text Secondary: 240 5% 50% (soft gray)
- Accent/CTA: 340 65% 70% (rose pink)
- Border/Divider: 240 10% 88% (subtle warm gray)

**Dark Mode:**
- Primary Background: 240 8% 18% (deep charcoal blue)
- Secondary Background: 240 10% 22% (slightly lighter charcoal)
- Card Backgrounds: Muted pastel variants - 350 35% 25% (dusty rose), 200 30% 28% (slate blue), 280 25% 26% (muted purple), 140 25% 26% (forest green), 45 30% 27% (warm taupe)
- Text Primary: 40 10% 92% (warm white)
- Text Secondary: 240 5% 70% (soft light gray)
- Accent/CTA: 340 55% 65% (bright rose)
- Border/Divider: 240 8% 32% (subtle divider)

### B. Typography
- **Primary Font**: 'Inter' or 'Plus Jakarta Sans' (Google Fonts) - modern, friendly, highly readable
- **Display/Headers**: 600-700 weight, 1.75rem to 2.5rem
- **Body Text**: 400 weight, 0.95rem to 1.05rem with 1.6 line-height for comfort
- **Note Titles**: 500-600 weight, 1.15rem
- **Buttons/UI**: 500 weight, 0.9rem with slight letter-spacing (0.02em)

### C. Layout System
**Spacing Primitives**: Use Tailwind units of 2, 3, 4, 6, 8, 12, 16
- Consistent padding: p-4 for cards, p-6 for sections, p-8 for page containers
- Gap between cards: gap-4 on mobile, gap-6 on desktop
- Vertical rhythm: space-y-6 for sections, space-y-3 for related groups

**Grid System:**
- Mobile (base): Single column with full-width cards (max-w-lg mx-auto)
- Tablet (md:): 2-column masonry grid
- Desktop (lg:): 3-4 column masonry grid with max-w-7xl container

### D. Component Library

**Navigation Bar:**
- Sticky top header with subtle backdrop blur (backdrop-blur-md)
- Logo/board name on left, actions (add note, menu) on right
- Height: h-16 with px-4 md:px-6
- Soft shadow: shadow-sm in light mode, border-b in dark mode

**Note Cards:**
- Rounded corners: rounded-2xl
- Soft shadows: shadow-md hover:shadow-lg transition
- Padding: p-5 with space-y-3 internal spacing
- Pinned indicator: Small pin icon (top-right) with accent color
- Color picker: Horizontal row of circular color swatches (w-8 h-8 rounded-full)
- Delete/edit icons: Subtle, appear on hover (opacity-0 group-hover:opacity-100)

**Buttons:**
- Primary CTA: Rounded-full px-6 py-2.5 with accent background
- Secondary: Outline variant with border-2, rounded-full
- Icon buttons: Rounded-lg p-2 hover:bg-opacity-10
- FAB (Add Note): Fixed bottom-right (bottom-6 right-6), rounded-full with shadow-xl, size w-14 h-14

**Forms/Inputs:**
- Text inputs: Rounded-xl border-2 focus:ring-2 focus:ring-accent/30
- Textarea: min-h-32 for note content, auto-resize
- Consistent padding: px-4 py-3
- Dark mode: Matching card backgrounds with subtle borders

**Modals/Dialogs:**
- Centered overlay with backdrop-blur-sm bg-black/20
- Content: Rounded-3xl with max-w-md, p-8
- Close button: Top-right absolute positioning

**Board Sharing UI:**
- Board code display: Monospace font in rounded-lg card with copy button
- Share link: Icon buttons for copy/share native sheet
- Join flow: Simple centered form with board code input

**Settings Panel:**
- Slide-in drawer from right (translate-x-full to translate-x-0)
- Dark mode toggle: Custom switch component with smooth transition
- Export/import: Simple button list with icon indicators

### E. Interactions & Animations
**Minimal, Purposeful Animations:**
- Card hover: Subtle scale (hover:scale-[1.02]) and shadow increase (150ms ease)
- Note reorder: Smooth drag with visual feedback (opacity-70 while dragging)
- Real-time updates: Gentle fade-in (animate-fadeIn from opacity-0)
- Color selection: Scale effect on tap (active:scale-95)
- Loading states: Subtle pulse animation for skeleton cards
- No complex scroll animations or parallax effects

## Mobile-First Responsive Strategy

**Base (Mobile < 768px):**
- Single column layout with px-4 page padding
- Full-width cards with comfortable spacing (space-y-4)
- Fixed FAB for easy thumb reach (bottom-20 safe area)
- Simplified header with hamburger menu for settings

**Tablet (md: 768px+):**
- 2-column masonry grid
- Expanded header with inline actions
- px-6 page padding

**Desktop (lg: 1024px+):**
- 3-4 column masonry grid (based on container width)
- Hover states become more prominent
- px-8 to px-12 page padding with max-w-7xl center

## PWA-Specific Elements
- **Install Prompt**: Cozy banner at bottom with soft gradient background matching theme
- **Offline Indicator**: Subtle toast notification (top-right) with pastel yellow/amber tint
- **Sync Status**: Small icon in header showing real-time connection (animated pulse when syncing)
- **App Icon**: Rounded square with pastel gradient background and note/pencil iconography

## Loading & Empty States
- **Loading**: Grid of skeleton cards with pulse animation in theme colors
- **Empty Board**: Centered illustration suggestion (pastel colored notebook/sticky note graphic) with friendly copy: "Your cozy notes space awaits"
- **No Results**: Simple text with subtle icon

## Authentication UI
- **Sign-In Screen**: Centered card with Google Sign-In button (white with Google colors)
- **User Avatar**: Circular (rounded-full) in header, size w-10 h-10
- **Auth Error States**: Toast notifications with soft error color (not harsh red)

## Critical UI Principles
- **Cozy Comfort**: Generous padding, soft shadows, rounded corners everywhere
- **Pastel Consistency**: All interactive elements use pastel accent colors from the defined palette
- **Touch-Friendly**: Minimum tap targets of 44px (h-11 min for buttons)
- **Visual Hierarchy**: Size and weight for importance, color for distinction (not primary communication)
- **Accessibility**: Maintain WCAG AA contrast ratios even with pastels (darker text on light pastels, lighter text on dark muted pastels)