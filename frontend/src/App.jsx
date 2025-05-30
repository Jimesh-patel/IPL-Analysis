import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Base from '../src/pages/Base';
import About from '../src/pages/About';
import NotFound from '../src/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Base />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
