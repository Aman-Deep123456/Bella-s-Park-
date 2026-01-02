# 🌿 Bella Spark — Interactive 3D Portfolio World

**Bella Spark** is an interactive **3D web environment** built using **Three.js** and **Blender**, designed as a **game-like portfolio experience**.

Users can explore the world, control a character, interact with objects, and view project details through modals.  
This project helped me understand **real-time 3D rendering, physics, collision detection, and interactivity on the web**.

---

## 🚀 Live Preview
👉 *(Add your live demo link here, if hosted)*

---

## 📦 GitHub Repository
👉 *This repository*

---

## 🛠️ Tech Stack

- **Three.js** – WebGL-based 3D rendering
- **Blender** – 3D modeling & scene creation
- **GLTF / GLB** – Optimized 3D asset format
- **JavaScript (ES Modules)**
- **HTML / CSS**
- **GSAP (planned / optional)** – Animations
- **Octree & Capsule Physics** – Collision detection

---

## ✨ Features

### 🎮 Player Movement
- WASD / Arrow key controls
- Jump mechanics with gravity
- Smooth rotation using interpolation (**LERP**)

### 🧱 Physics & Collision
- Capsule-based player collider
- Octree-based environment collision detection
- Ground detection & respawn system

### 🧭 Camera System
- Orthographic camera
- Dynamic camera follow with offset
- OrbitControls (pan & zoom enabled)

### 🌞 Lighting & Shadows
- Directional sunlight with soft shadows
- Ambient lighting for realism
- ACES Filmic tone mapping

### 🖱️ Raycasting Interaction
- Hover detection on interactive objects
- Click-based modal opening

### 🪟 Modal UI
- Project information popups
- External project links
- “About Me” section

---

## 🎮 Controls

| Action        | Key        |
|--------------|-----------|
| Move Forward | W / ↑ |
| Move Backward | S / ↓ |
| Move Left | A / ← |
| Move Right | D / → |
| Jump | Auto (on movement) |
| Respawn | R |
| Interact | Mouse Click |

---

## 📂 Project Structure

```text
├── index.html
├── style.css
├── script.js
├── portfolio.glb
├── assets/
│   └── textures / models
