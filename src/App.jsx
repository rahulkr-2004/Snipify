import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Documentation from './pages/Documentation';
import Explore from './pages/Explore';
import ProfileModal from './components/ProfileModal';
import { useState } from 'react';
import AnimatedBackground from './components/AnimatedBackground';

import Dashboard from './pages/Dashboard';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between items-center bg-black/40 gap-4 md:gap-0">
        <Link to="/" className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-black flex items-center justify-center shadow-[0_0_15px_rgba(111,85,255,0.4)]">
            <img src="/logo.png" alt="Snipify Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl md:text-3xl font-normal text-white mt-1" style={{ fontFamily: '"Nosifer", "Creepster", cursive', letterSpacing: '2px' }}>
            SNIPIFY
          </h1>
        </Link>
        
        <div className="flex items-center gap-4 md:gap-6 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 justify-start md:justify-end custom-scrollbar">
          <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors whitespace-nowrap">
            Home
          </Link>
          <Link to="/explore" className="text-sm font-medium text-gray-300 hover:text-white transition-colors whitespace-nowrap">
            Explore
          </Link>
          <Link to="/docs" className="text-sm font-medium text-gray-300 hover:text-white transition-colors whitespace-nowrap">
            Documentation
          </Link>
          <Link to="/about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors whitespace-nowrap">
            About Us
          </Link>
          <button onClick={() => setIsProfileOpen(true)} className="text-sm font-medium text-gray-300 hover:text-white transition-colors whitespace-nowrap shrink-0">
            Profile
          </button>
        </div>
      </header>
      
      <main className="relative">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/explore" element={<PrivateRoute><Explore /></PrivateRoute>} />
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard openProfile={() => setIsProfileOpen(true)} />
            </PrivateRoute>
          } />
        </Routes>
      </main>
      
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}

export default App;
