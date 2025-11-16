<div align="center">

# 🍳 **R E C I P E D I A**

### ✨ *Your Ultimate Recipe Discovery & Management Platform* ✨

<img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
<img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
<img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
<img src="https://img.shields.io/badge/LCP-<2.5s-success?style=for-the-badge&logo=lighthouse&logoColor=white" alt="Performance"/>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

</div>

## 📸 **Screenshots**

<div align="center">

### 🏠 Home Page
<img src="client/public/Screenshot 2025-11-17 at 1.36.30 AM.png" alt="Home Page" width="800"/>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 📖 Recipe Dashboard
<img src="client/public/Screenshot 2025-11-17 at 1.38.42 AM.png" alt="Recipe Dashboard" width="800"/>

</div>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🚀 **Quick Start**

### **Prerequisites**
```bash
Node.js (v14+) | MongoDB | npm/yarn
```

### **Installation Steps**

**1️⃣ Clone the repository**
```bash
git clone https://github.com/yourusername/recipedia.git
cd recipedia
```

**2️⃣ Set up environment variables**

Create `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

**3️⃣ Install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

**4️⃣ Start the application**

```bash
# Terminal 1 - Start backend server
cd server
npm start
# 🚀 Server runs on http://localhost:5000

# Terminal 2 - Start frontend
cd client
npm start
# 🎨 Client runs on http://localhost:3000
```

**5️⃣ Open your browser**

Navigate to `http://localhost:3000` and start exploring! 🎉

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<details>
<summary><h2>🌟 Features</h2></summary>

### **📖 Recipe Management**
- ✨ Create, edit, and delete recipes
- 🖼️ Upload recipe images & videos
- 📝 Detailed ingredients & instructions
- ⏱️ Preparation time tracking
- 🏷️ Category organization
- ⭐ Star rating system

### **🔍 Smart Discovery**
- 🎨 Beautiful recipe grid layout
- 🔎 Real-time search functionality
- 🎛️ Advanced filtering by category
- 📊 Sort by popularity, time, or name
- ♾️ Infinite scroll loading
- 🚀 Virtualized rendering for performance

### **🧊 FridgeMate**
- 🥗 Ingredient-based recipe matching
- 📦 Virtual pantry management
- 🎯 Smart recipe suggestions
- 📊 Match percentage display
- 🛒 Missing ingredients list

### **👥 Social Features**
- 👤 Creator profiles
- 🌐 Recipe sharing (Social media, QR codes)
- 📱 Enhanced share options
- 🖨️ Print-friendly recipes
- 💬 Community engagement

### **🎨 User Experience**
- 📱 Fully Responsive - Works on all devices
- 🌈 Modern UI/UX - Beautiful animations
- ♿ Accessible - WCAG compliant
- 🎭 Interactive - Smooth transitions
- 🔔 Toast Notifications - Real-time feedback

</details>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<details>
<summary><h2>🛠️ Tech Stack</h2></summary>

### **Frontend**
```
React 18.2          → UI library
React Router        → Navigation
Framer Motion       → Animations
React Virtuoso      → Virtualized lists
Axios               → HTTP client
React Toastify      → Notifications
DOMPurify           → XSS protection
React Icons         → Icon library
```

### **Backend**
```
Node.js             → Runtime
Express             → Web framework
MongoDB             → Database
Mongoose            → ODM
JWT                 → Authentication
Bcrypt              → Password hashing
Multer              → File uploads
Node-Cache          → Caching
```

### **Performance**
```
React.memo          → Component memoization
useCallback         → Stable callbacks
Normalized State    → Efficient data structure
Lazy Loading        → On-demand loading
Image Optimization  → Priority loading
API Preconnect      → Faster requests
```

</details>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<details>
<summary><h2>📊 Performance Metrics</h2></summary>

### **Core Web Vitals**

| Metric | Score | Status |
|--------|-------|--------|
| **LCP** (Largest Contentful Paint) | < 2.5s | ✅ Good |
| **FID** (First Input Delay) | < 100ms | ✅ Good |
| **CLS** (Cumulative Layout Shift) | < 0.1 | ✅ Good |
| **FCP** (First Contentful Paint) | < 1.8s | ✅ Good |
| **TTI** (Time to Interactive) | < 3.8s | ✅ Good |

### **Optimization Highlights**
- 🎯 **67% faster LCP** - Reduced from 6.68s to < 2.5s
- 📦 **80% less initial data** - Load 6 recipes instead of 30
- 🖼️ **Priority image loading** - Above-the-fold content first
- ♻️ **Zero unnecessary re-renders** - Smart caching strategy
- 🚀 **Infinite scroll** - Smooth, performant pagination

</details>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<details>
<summary><h2>📁 Project Structure</h2></summary>

```
recipedia/
├── 📂 client/                 # Frontend React application
│   ├── 📂 public/            # Static files
│   ├── 📂 src/
│   │   ├── 📂 components/    # Reusable components
│   │   ├── 📂 pages/         # Page components
│   │   ├── 📂 services/      # API services
│   │   ├── 📂 hooks/         # Custom hooks
│   │   ├── 📂 styles/        # CSS files
│   │   └── 📄 App.jsx        # Main app component
│   └── 📄 package.json
│
├── 📂 server/                # Backend Node.js application
│   ├── 📂 models/           # MongoDB models
│   ├── 📂 routes/           # API routes
│   ├── 📂 middleware/       # Custom middleware
│   ├── 📂 controllers/      # Route controllers
│   ├── 📄 index.js          # Server entry point
│   └── 📄 package.json
│
└── 📄 README.md
```

</details>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🤝 **Contributing**

Contributions are **welcome**! Here's how you can help:

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m 'Add some AmazingFeature'

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<details>
<summary><h2>📝 License</h2></summary>

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Recipedia

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

</details>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<div align="center">

### 💖 **Made with Love and Code** 💖

**🍕 Happy Cooking! 🍕**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**[⬆ Back to Top](#-r-e-c-i-p-e-d-i-a)**

</div>
