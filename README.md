# SIVARAMAKRISHNAN — IMMERSIVE 3D EDITORIAL PORTFOLIO

A luxury, interactive **3D fashion-editorial portfolio website** for **Sivaramakrishnan** — Frontend Developer & Generative AI Designer.

Inspired by contemporary high-fashion editorial layouts, oversized typographic architecture, and real-time interactive 3D WebGL character presentation.

---

## 🎨 Visual Identity & Aesthetic

- **Design Philosophy**: Minimalist luxury fashion editorial, high contrast, generous whitespace, asymmetric layout.
- **Color Palette**:
  - **Background**: Warm Ivory & Subtle Editorial Paper (`#FAF9F6`, `#F3EFE8`)
  - **Primary Red**: High-Fashion Vibrant Editorial Red (`#E5232E`)
  - **Text Primary**: Deep Charcoal Black (`#111111`)
  - **Supporting Text**: Muted Editorial Grey (`#666666`, `#999999`)
  - **Hairlines & Borders**: Editorial Stone (`#E8E4DC`)
- **Typography**:
  - **Display / Headlines**: `Syne` (Oversized, heavy grotesque display font)
  - **Editorial Accent**: `Playfair Display` (Classic editorial serif)
  - **Body Text**: `Plus Jakarta Sans` (Clean, geometric readability)
  - **Metadata & Telemetry**: `Space Mono` (Archival issue stamps, timestamps, coordinates)

---

## 🧍 Interactive 3D Character (Hero & Scroll Journey)

- **Engine**: Three.js WebGL with `THREE.GLTFLoader`
- **Asset**: Rigged full-body contemporary male humanoid model (`assets/models/character.glb`)
- **Lighting & Shadows**:
  - Studio directional key light with soft shadow mapping
  - Ambient warm ivory fill bounce
  - Rim light for crisp silhouette definition
  - Procedural soft radial ground contact shadow
- **Interactive Dynamics**:
  - **Idle Animation**: Natural relaxed breathing cadence via `THREE.AnimationMixer`
  - **Mouse Tracking**: Real-time bone orientation (`Head`, `Neck`, `Spine`) smoothly following the user's cursor
  - **User Drag**: Click and drag (or mobile swipe) to smoothly spin the character with inertial friction damping
  - **Scroll Choreography**: Smooth camera zoom and character pose shifts synchronized with section transitions (Cover → Identity → Capabilities → Selected Archives → Inquiries)
  - **Graceful Fallback**: Procedural architectural mannequin automatically renders if WebGL or external GLB model loading encounters latency or restrictions.

---

## 📂 Archival Sections

1. **Cover / Hero**:
   - Oversized red editorial typography (`SIVARAMAKRISHNAN`)
   - Professional identity tags: `Frontend Developer / Generative AI Designer / Creative Coder`
   - Academic background indicator (`B.Tech Electrical & Electronics Engineering`)
   - Primary action buttons: Explore Archives & Download CV
2. **01 // Architectural Identity & Narrative**:
   - Detailed philosophy translating electrical circuit precision and signal flow into modern zero-defect frontend architecture
   - Editorial specifications table (Degree, Paradigm, Performance, Location)
3. **02 // Technical Matrix & Capabilities**:
   - 4-column curated competency matrix (Frontend Core, Spatial Computing, Generative AI & System Logic, Tooling & Infrastructure)
4. **03 // Selected Archives (6 Production Repositories)**:
   - **01: Smart Cashback POS** (FinTech / Retail Platform)
   - **02: UPI Fraud Detection** (FinTech / ML Security Engine)
   - **03: Integrated Disconnection Portal** (Utility / Enterprise Operations)
   - **04: Ledger Account Book** (Finance / Double-Entry Ledger)
   - **05: Intelligent PDF Converter** (Productivity / Document Engine)
   - **06: Bank Account Closure Portal** (Banking / Digital Workflow)
5. **04 // Inquiries & Engagements**:
   - Direct interactive contact boxes (`sivar75@gmail.com`, `+91 9876543210`)
   - Direct links to GitHub profile and downloadable resume
   - Editorial copyright and smooth return-to-surface trigger

---

## 🚀 Deployment & Compatibility

- **Live URL**: [https://sivasan18.github.io/About-me/](https://sivasan18.github.io/About-me/)
- **Repository**: [https://github.com/sivasan18/About-me](https://github.com/sivasan18/About-me)
- **Zero-FOUC Guarantee**: Inline critical styles + external stylesheet compatibility with `.nojekyll` enabled for GitHub Pages.
