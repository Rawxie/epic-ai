---
name: EPIC Academic Studio
colors:
  surface: '#FBF9F1'
  surface-dim: '#dcdad2'
  surface-bright: '#fbf9f1'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f4ec'
  surface-container: '#F0EEE6'
  surface-container-high: '#eae8e0'
  surface-container-highest: '#e4e3db'
  on-surface: '#0A192F'
  on-surface-variant: '#4d4632'
  inverse-surface: '#30312c'
  inverse-on-surface: '#f3f1e9'
  outline: '#7f7660'
  outline-variant: '#d1c6ab'
  surface-tint: '#735c00'
  primary: '#735c00'
  on-primary: '#ffffff'
  primary-container: '#facc15'
  on-primary-container: '#6c5700'
  inverse-primary: '#eec200'
  secondary: '#904d00'
  on-secondary: '#ffffff'
  secondary-container: '#fca558'
  on-secondary-container: '#713b00'
  tertiary: '#515f78'
  on-tertiary: '#ffffff'
  tertiary-container: '#c3d1ee'
  on-tertiary-container: '#4c5a72'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe083'
  primary-fixed-dim: '#eec200'
  on-primary-fixed: '#231b00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77c'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6e3900'
  tertiary-fixed: '#d5e3ff'
  tertiary-fixed-dim: '#b9c7e4'
  on-tertiary-fixed: '#0d1c32'
  on-tertiary-fixed-variant: '#39475f'
  background: '#fbf9f1'
  on-background: '#1b1c17'
  surface-variant: '#e4e3db'
  outline-muted: rgba(127, 118, 96, 0.15)
  code-bg: '#0A192F'
typography:
  h1:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  h1-mobile:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  h2:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h3:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.08em
  mono-code:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 64px
  gutter: 24px
  margin-mobile: 16px
  container-max: 1280px
---

## Brand & Style
The brand personality is **Intellectual, Dynamic, and Validating**. It targets the intersection of traditional academia and the rapid-build "startup" culture. The UI should evoke a sense of professional urgency—moving from passive consumption to active creation.

The design style is **Modern Academic-Brutalism**. It utilizes a structured, high-contrast grid with thin, low-opacity borders (`border-outline/15`) and "stamped" labels. It balances the warmth of an ivory/cream paper aesthetic with the high-energy "caution" yellow of technical building sites. This creates a "Studio" feel rather than an "LMS" feel—emphasizing artifacts, proof, and live data feeds over static text.

## Colors
The palette is rooted in a **High-Contrast "Paper & Ink"** foundation.
- **Primary (Yellow):** Used for highlighting key "builder" actions, progress bars, and high-importance UI nodes. It acts as the "validating" highlight.
- **Surface (Cream/Ivory):** The background mimics high-quality academic paper, providing a warmer, more sophisticated alternative to pure white.
- **On-Surface (Midnight Navy):** Text and core icons use a deep midnight navy instead of black to maintain a premium, intellectual depth.
- **Secondary/Tertiary:** Earthy ambers and slate blues are reserved for status indicators, background containers, and decorative chart elements.

## Typography
The system uses a triple-threat font strategy:
1.  **Sora (Display):** Geometric and bold. Used for headlines to convey a technical, forward-looking aesthetic.
2.  **Inter (UI/Body):** Highly legible and neutral. Used for all functional text to keep the interface feeling utilitarian and clear.
3.  **JetBrains Mono (Technical):** Used for "proof" logs, transcripts, and metadata to reinforce the concept of a "studio" or "lab" environment.

## Layout & Spacing
The layout follows a **Fixed-Width Container Model** for desktop ($1280px) and a **Fluid Fluid-Gutter Model** for mobile. 
- **Grid Logic:** A 12-column system is used, but content is primarily grouped into "Bento" blocks or 50/50 splits.
- **Rhythm:** Spacing is strictly based on a 4px/8px baseline. Large vertical separators (XXL) are used to delineate major "sections" of the experiential journey.
- **Section Breaks:** Every major section is capped with a thin horizontal border (`border-outline/15`) rather than just whitespace, emphasizing the "structured pathway" concept.

## Elevation & Depth
Depth is created through **Layered Flatness** and **Minimal Stacks** rather than traditional lighting.
- **Shadows:** A single, highly diffused "minimal-stack" shadow (`0 20px 40px rgba(10, 25, 47, 0.04)`) is used sparingly on primary cards and floating elements.
- **Z-Index Strategy:** Active learning artifacts (like cards in the hero) use overlapping z-indexes to simulate a physical desk covered in papers.
- **Surface Tiers:** Backgrounds are `#FBF9F1`. Container backgrounds move to `#F0EEE6` (High) or `#F5F4EC` (Low) to signify hierarchy.
- **Patterns:** A subtle 20px dot-matrix grid is used behind feature sections to imply a "blueprint" or "drafting" space.

## Shapes
The shape language is **Technical and Transitional**.
- **Core Elements:** Cards and sections use a 0.75rem (`xl`) radius to soften the high-contrast borders.
- **Interactive Elements:** Buttons and badges use a **Full Pill** radius (`9999px`) to distinguish them as actionable items within the otherwise rigid grid.
- **Labels:** Small labels and tags often have 0px radius or a very slight "stamp" effect to feel like physical documentation.

## Components
- **Primary Buttons:** Bold Yellow (`primary`) with Navy text. They use a pill shape, a subtle shadow, and a thin border. 
- **Secondary/Ghost Buttons:** Transparent background with a `on-surface` border.
- **Bento Cards:** Feature blocks with fixed borders, internal padding (`lg`), and a background transition on hover.
- **Transcript/Log Feed:** A specific dark-mode component using `JetBrains Mono` on a Navy background, simulating a real-time AI process.
- **Proof Badges:** Small, high-contrast rectangles (`[Build]`, `[Learn]`) often rotated by 3-6 degrees to look like stickers or physical stamps.
- **Visual Progress Indicators:** Progress bars should be thin, using the Primary color for the fill and a neutral-container for the track.