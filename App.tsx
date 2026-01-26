import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Guides } from './components/Guides';
import { Documents } from './components/Documents';
import { Map } from './components/Map';
import { Restaurants } from './components/Restaurants';
import { Hotels } from './components/Hotels';
import { DocumentProcedures } from './components/DocumentProcedures';
import { Auth } from './components/Auth';
import { Admin } from './components/Admin';
import { motion, AnimatePresence } from 'framer-motion';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/guides" element={<PageWrapper><Guides /></PageWrapper>} />
        <Route path="/documents" element={<PageWrapper><Documents /></PageWrapper>} />
        <Route path="/procedures" element={<PageWrapper><DocumentProcedures /></PageWrapper>} />
        <Route path="/restaurants" element={<PageWrapper><Restaurants /></PageWrapper>} />
        <Route path="/hotels" element={<PageWrapper><Hotels /></PageWrapper>} />
        <Route path="/map" element={<PageWrapper><Map /></PageWrapper>} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-slate-950">
      {!isAuthPage && <Sidebar />}
      <main className={`flex-1 relative ${!isAuthPage ? 'md:ml-64' : ''}`}>
        <AnimatedRoutes />
      </main>
    </div>
  );
};

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;
