import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { defaultIndustrySlug } from "./data/industries";
import { NavBar } from "./components/NavBar";
import { Home } from "./pages/Home";
import { CalendarPage } from "./pages/CalendarPage";
import { IndustryPage } from "./pages/IndustryPage";
import { StockDetail } from "./pages/StockDetail";
import { ResearchPage } from "./pages/ResearchPage";

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
          <Route path="/research" element={<ResearchPage />} />
        </Routes>
        <footer className="site-footer">
          <p>US MARKET LEARN · TERMINAL UI v1 · 非投资建议</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
