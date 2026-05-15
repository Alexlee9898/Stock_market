import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

export function NavBar() {
  const { theme, toggle } = useTheme();

  return (
    <header className="nav-shell">
      <div className="nav-inner">
        <Link to="/" className="nav-brand">
          <span className="nav-brand-mark" aria-hidden />
          美股学习
        </Link>
        <nav className="nav-links" aria-label="主导航">
          <NavLink to="/" className={({ isActive }) => "nav-link" + (isActive ? " nav-link--active" : "")} end>
            热门公司
          </NavLink>
          <NavLink to="/calendar" className={({ isActive }) => "nav-link" + (isActive ? " nav-link--active" : "")}>
            财经日历
          </NavLink>
          <NavLink
            to="/industries"
            className={({ isActive }) => "nav-link" + (isActive ? " nav-link--active" : "")}
          >
            产业研究
          </NavLink>
          <NavLink
            to="/research"
            className={({ isActive }) => "nav-link" + (isActive ? " nav-link--active" : "")}
          >
            研报
          </NavLink>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggle}
            aria-label={theme === "dark" ? "切换浅色模式" : "切换深色模式"}
            title={theme === "dark" ? "切换浅色模式" : "切换深色模式"}
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </nav>
      </div>
    </header>
  );
}
