import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { defaultIndustrySlug } from "./data/industries";
import { NavBar } from "./components/NavBar";
import { Home } from "./pages/Home";
import { CalendarPage } from "./pages/CalendarPage";
import { IndustryPage } from "./pages/IndustryPage";
import { StockDetail } from "./pages/StockDetail";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-root">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/industries" element={<Navigate to={`/industries/${defaultIndustrySlug}`} replace />} />
          <Route path="/industries/:industrySlug" element={<IndustryPage />} />
          <Route path="/stock/:symbol" element={<StockDetail />} />
        </Routes>
        <footer className="site-footer">
          <p>美股学习演示 · 界面灵感来自 Apple 产品页的留白与排版节奏</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
