import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navigation from './components/Navigation';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Surah from './pages/Surah';
import Detail from './pages/Detail';
import Favorite from './pages/Favorite';
import Jadwal from './pages/Jadwal';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound/>} />
        <Route path="/surah" element={<Surah/>} />
        <Route path="/surah/:id" element={<Detail/>} />
        <Route path="/favorite" element={<Favorite/>} />
        <Route path="/jadwal" element={<Jadwal/>} />
      </Routes>
      <Navigation />
    </BrowserRouter>
  );
}

export default App;
