import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import Draw from './screens/Draw';
import Enhance from './screens/Enhance';
import Ranking from './screens/Ranking';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const userId = localStorage.getItem('userId');
  if (!userId) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
      <Route path="/draw" element={<RequireAuth><Draw /></RequireAuth>} />
      <Route path="/enhance/:id" element={<RequireAuth><Enhance /></RequireAuth>} />
      <Route path="/ranking" element={<RequireAuth><Ranking /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
