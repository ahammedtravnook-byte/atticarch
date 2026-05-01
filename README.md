# AtticArch — Premium Interior Design & Architecture

Welcome to the official repository for **AtticArch**, a state-of-the-art, high-end interior design and architectural consultancy platform. Since 2002, AtticArch has been transforming spaces and lives across Bangalore. This web application serves as the digital front door to their luxurious services, portfolio, and expert consultations.

## 🌟 Overview

The AtticArch platform is built with a focus on **immersive, cinematic UX** and **award-winning design aesthetics**. It features buttery-smooth scrolling, glassmorphism UI components, parallax animations, and seamless page transitions designed to make the user feel the luxury of the brand before they even book a consultation.

### Key Features
- **Cinematic Scroll Experience:** Powered by Lenis and Framer Motion for momentum-based, butter-smooth navigation.
- **Dynamic Hero Interactions:** Staggered typography reveals, ambient glowing orbs, and scale-morphing sections.
- **Smart Estimate Calculator:** An interactive tool for users to get instant ballpark quotes for their projects.
- **Immersive Portfolio Gallery:** A high-contrast, edge-to-edge showcase of residential, commercial, and villa projects.
- **Premium Design System:** Hand-crafted CSS variables (`variables.css`) ensuring strict adherence to the brand's luxurious gold, charcoal, and warm-white palette.

## 🚀 Technology Stack

- **Frontend Framework:** React.js + Vite
- **Routing:** React Router DOM
- **Animations:** Framer Motion & GSAP (GreenSock)
- **Smooth Scrolling:** Lenis (@studio-freight/lenis)
- **Styling:** Vanilla CSS3 with Custom Properties (CSS Variables)
- **Icons:** Lucide React & React Icons

## 🛠️ Getting Started

To run this project locally, ensure you have Node.js installed on your machine.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ahammedtravnook-byte/atticarch.git
   ```

2. **Navigate to the website directory:**
   ```bash
   cd atticarch/website
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   *The application will typically start on `http://localhost:5173`.*

## 📦 Building for Production

To create an optimized production build:

```bash
cd website
npm run build
```
This will output the highly-optimized static assets into the `website/dist` directory, ready to be deployed to Vercel, Netlify, or Hostinger.

## 🎨 Design System

All global tokens for colors, typography, and spacing are strictly managed in `src/styles/variables.css`.
- **Primary Colors:** Gold (`#c9a96e`), Charcoal (`#1a1a1a`), Warm White (`#fefcf9`)
- **Typography:** Display (`Playfair Display` or equivalent), Sans (`Inter` or equivalent)
- **Radii & Shadows:** Soft, large border-radiuses (`24px` to `80px`) and deep, elegant shadows to create depth.

---
*Crafted with precision for ATTICARCH. Transforming Spaces, Transforming Lives.*
