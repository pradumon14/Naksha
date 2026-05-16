
# 📍 Project Naksha

> **Interactive Geography for the Modern Student**  
> *Turning rote memorization into visual exploration.*

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)

Naksha is an interactive, open-source geography learning platform designed to help students master the map of India. By combining high-fidelity vector graphics with gamified learning mechanics, Naksha transforms static textbook study into an engaging, hands-on experience.

---

## 📖 The Origin Story

The idea for **Naksha** was born out of personal necessity during my Class 10 academic year. Like millions of students preparing for board exams, I struggled with **Mapwork**. 

Textbooks provided static, cluttered images. Online tutorials were low-resolution videos that didn't allow for hands-on practice. I realized that to truly master the geography of India—from the Nuclear Power Plants in the south to the Himalayan dams in the north—I needed to **interact** with the data, not just stare at it.

What started as a series of high-quality PDFs has evolved into this dynamic web application.

---

## ⚙️ Engineering Philosophy & Challenges

Building a map application without relying on heavy third-party GIS libraries or paid APIs (like Google Maps) required a custom-built **SVG Rendering Engine**. This approach ensures the app remains lightweight, privacy-focused, and free forever.

### 1. The Spatial Reasoning Challenge
During development, I explored using LLMs to generate map data. However, I discovered a significant limitation in current AI: **Spatial Reasoning**.
*   **Geometric Incoherence:** AI-generated SVG paths often resulted in distorted or geographically incorrect shapes.
*   **Coordinate Hallucination:** Models could not accurately map real-world locations to a custom coordinate grid.

**Conclusion:** While AI is excellent for logic and boilerplate, precise visual-spatial translation still requires human engineering and manual calibration.

### 2. The Calibration Engine
The map operates on a massive coordinate space (`21000 x 29700` units). To ensure pixel-perfect accuracy for every dam, airport, and mine, I built a custom **Calibration Mode**:
1.  **Coordinate Translation:** A system that translates screen-space clicks into the SVG's internal matrix space.
2.  **Rapid Mapping:** A workflow that allows developers to visually place markers and export the resulting JSON data.
3.  **Efficiency:** This tool reduced the time required to map new locations from hours to minutes.

---

## 🚀 Key Features

*   **🗺️ High-Resolution Vector Fidelity:** Uses an optimized SVG map that remains crisp at any zoom level, essential for identifying small geographic features.
*   **🖱️ Interactive Viewport:** Custom implementation of Pan & Zoom logic using mathematical transformations for smooth performance.
*   **📱 Mobile-First Design:** Full support for touch gestures, including pinch-to-zoom and two-finger drag.
*   **🎯 Gamified Learning (Quiz Mode):**
    *   Randomized questioning based on the official syllabus.
    *   **Visual Feedback Loop:** If a user clicks incorrectly, a visual line is procedurally drawn to the correct location, reinforcing spatial memory.
    *   **Streak & Badge System:** Encourages consistent practice through rewards and progress tracking.
*   **🔊 Procedural Audio Engine:** To keep the bundle size minimal, all sound effects are synthesized in real-time using the **Web Audio API**, avoiding heavy `.mp3` loading.

---

## 🏗️ Architecture Overview

Naksha is built with a modular, state-driven architecture, strictly typed for maximum stability:

*   **`IndiaMap.tsx`**: The core rendering component for the SVG map and its various layers (Borders). Fully memoized to prevent expensive re-renders.
*   **`index.tsx`**: The orchestrator. Manages UI Overlays, Layers (Labels, Markers), Modals, and high-level coordinate transformations. 
*   **`useQuizEngine.ts`**: A custom hook managing the complex state of the gamified quiz, including randomization, scoring, combinations, and feedback logic.
*   **`useMapZoom.ts`**: Handles the mathematical view states (translateX, translateY, scale) for zooming, panning, and touch interactions across the coordinate space.
*   **`data.ts`**: The central source of truth for all geographic locations, categorized by topics like "Airports" or "Dams".
*   **`utils.ts`**: Contains pure helper functions for array manipulation and the real-time Web Audio Synthesizer.

---

## 🛠️ Tech Stack

*   **Framework:** React (v18)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (Utility-first)
*   **State Management:** React Hooks (useState, useMemo, useCallback)
*   **Build Engine:** Vite

---

## 🏃‍♂️ Getting Started

### Prerequisites
*   Node.js (v18+)
*   npm or yarn or pnpm

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/pradumon14/naksha.git
    cd naksha
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

**Note:** The application will run entirely client-side. No backend configuration or API keys are required.

---

## 🤝 Contributing

Contributions are heavily welcomed! Whether it's adding new map locations to `data.ts`, fixing coordinate bugs, or improving the mobile UI, feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. Feel free to use it for your school, college, or personal curriculum.

---

## 👨‍💻 Author

**Pradumon Sahani**  
*Professional Software Engineer*

Created with ❤️ to make education free, accessible, and interactive. If this project helped you, please consider giving it a ⭐ on GitHub!

