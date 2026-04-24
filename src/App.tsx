/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import StockDetail from './pages/StockDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/detail/:id" element={<StockDetail />} />
          {/* Fallback routes for demo */}
          <Route path="/portfolio" element={<Dashboard />} />
          <Route path="/settings" element={<Dashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

