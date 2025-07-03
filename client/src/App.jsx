// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toastify-fix.css'; // Custom CSS to fix passive event listener warning
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import FridgeMate from './pages/FridgeMate';
import Recipes from './pages/Recipes';
import Navbar from './component/Navbar';
import PrivateRoute from './component/PrivateRoute';
import Footer from './component/Footer';

function App() {
  const currentPath = window.location.pathname;
  const showFooter =
    currentPath !== '/recipes' &&
    currentPath !== '/about'; // '/about' also shows recipes for backward compatibility

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/about" element={<Recipes />} />
        <Route path="/fridge-mate" element={<FridgeMate />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
      {showFooter && <Footer />}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
