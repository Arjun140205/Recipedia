<div align="center">

# 🍳 Recipedia

### *Your Ultimate Recipe Discovery & Management Platform*

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Performance](https://img.shields.io/badge/LCP-<2.5s-success?style=for-the-badge&logo=lighthouse&logoColor=white)](https://web.dev/lcp/)

[Features](#-features) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [Performance](#-performance)

---

</div>

## 🌟 Features

### 🎯 Core Features

<table>
<tr>
<td width="50%">

#### 📖 Recipe Management
- ✨ Create, edit, and delete recipes
- 🖼️ Upload recipe images & videos
- 📝 Detailed ingredients & instructions
- ⏱️ Preparation time tracking
- 🏷️ Category organization
- ⭐ Star rating system

</td>
<td width="50%">

#### 🔍 Smart Discovery
- 🎨 Beautiful recipe grid layout
- 🔎 Real-time search functionality
- 🎛️ Advanced filtering by category
- 📊 Sort by popularity, time, or name
- ♾️ Infinite scroll loading
- 🚀 Virtualized rendering for performance

</td>
</tr>
<tr>
<td width="50%">

#### 🧊 FridgeMate
- 🥗 Ingredient-based recipe matching
- 📦 Virtual pantry management
- 🎯 Smart recipe suggestions
- 📊 Match percentage display
- 🛒 Missing ingredients list

</td>
<td width="50%">

#### 👥 Social Features
- 👤 Creator profiles
- 🌐 Recipe sharing (Social media, QR codes)
- 📱 Enhanced share options
- 🖨️ Print-friendly recipes
- 💬 Community engagement

</td>
</tr>
</table>

### ⚡ Performance Optimizations

- 🎯 **LCP < 2.5s** - Lightning-fast page loads
- 🖼️ **Priority Image Loading** - Above-the-fold content first
- ♻️ **Smart Caching** - No unnecessary re-renders
- 🎨 **Shimmer Placeholders** - Smooth loading experience
- 📦 **Lazy Loading** - Load content as you scroll
- 🚀 **Virtualization** - Handle thousands of recipes efficiently

### 🎨 User Experience

- 📱 **Fully Responsive** - Works on all devices
- 🌈 **Modern UI/UX** - Beautiful animations with Framer Motion
- ♿ **Accessible** - WCAG compliant
- 🎭 **Interactive** - Smooth transitions and hover effects
- 🔔 **Toast Notifications** - Real-time feedback
- 🎪 **Loading States** - Engaging food-themed loaders

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1️⃣ **Clone the repository**
```bash
git clone https://github.com/yourusername/recipedia.git
cd recipedia
```

2️⃣ **Set up environment variables**

Create `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

3️⃣ **Install dependencies**

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

4️⃣ **Start the application**

**Option A: Run both servers separately**

```bash
# Terminal 1 - Start backend server
cd server
npm start
# Server runs on http://localhost:5000

# Terminal 2 - Start frontend
cd client
npm start
# Client runs on http://localhost:3000
```

**Option B: Run from root (if configured)**

```bash
# Start backend
npm run server

# Start frontend
npm run client
```

5️⃣ **Open your browser**

Navigate to `http://localhost:3000` and start exploring! 🎉

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI library
- **React Router** - Navigation
- **Framer Motion** - Animations
- **React Virtuoso** - Virtualized lists
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **DOMPurify** - XSS protection
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Node-Cache** - Caching

### Performance
- **React.memo** - Component memoization
- **useCallback** - Stable callbacks
- **Normalized State** - Efficient data structure
- **Lazy Loading** - On-demand loading
- **Image Optimization** - Priority loading
- **API Preconnect** - Faster requests

---

## 📊 Performance

### Core Web Vitals

| Metric | Score | Status |
|--------|-------|--------|
| **LCP** (Largest Contentful Paint) | < 2.5s | ✅ Good |
| **FID** (First Input Delay) | < 100ms | ✅ Good |
| **CLS** (Cumulative Layout Shift) | < 0.1 | ✅ Good |
| **FCP** (First Contentful Paint) | < 1.8s | ✅ Good |
| **TTI** (Time to Interactive) | < 3.8s | ✅ Good |

### Optimization Highlights

- 🎯 **67% faster LCP** - Reduced from 6.68s to < 2.5s
- 📦 **80% less initial data** - Load 6 recipes instead of 30
- 🖼️ **Priority image loading** - Above-the-fold content first
- ♻️ **Zero unnecessary re-renders** - Smart caching strategy
- 🚀 **Infinite scroll** - Smooth, performant pagination

---

## 📁 Project Structure

```
recipedia/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   ├── styles/        # CSS files
│   │   └── App.jsx        # Main app component
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── controllers/      # Route controllers
│   ├── index.js          # Server entry point
│   └── package.json
│
└── README.md
```

---

## 🎯 Key Features Breakdown

### 🔐 Authentication
- Secure JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- User session management

### 📖 Recipe CRUD
- Create recipes with images/videos
- Edit existing recipes
- Delete recipes
- View detailed recipe information

### 🔍 Search & Filter
- Real-time search
- Category filtering
- Multiple sort options
- Responsive results

### 🧊 FridgeMate
- Add ingredients to virtual pantry
- Find recipes based on available ingredients
- See match percentages
- View missing ingredients

### 👥 Social
- Share recipes on social media
- Generate QR codes
- Print recipes
- View creator profiles

---

## 🎨 Screenshots

<div align="center">

### 🏠 Home Page
*Beautiful landing page with featured recipes*

### 📖 Recipe Dashboard
*Manage all your recipes in one place*

### 🧊 FridgeMate
*Find recipes based on your ingredients*

### 👤 Creator Profile
*Showcase your culinary creations*

</div>

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Icons by [React Icons](https://react-icons.github.io/react-icons/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- UI inspiration from modern recipe platforms

---

<div align="center">

### Made with ❤️ and 🍕

**[⬆ Back to Top](#-recipedia)**

</div>
