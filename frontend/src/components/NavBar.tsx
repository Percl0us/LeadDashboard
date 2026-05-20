import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const linkStyles = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-slate-900 text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

const NavBar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Smart Leads Dashboard
          </p>
          <h1 className="mt-1 text-xl font-semibold text-slate-900">
            Lead Management Workspace
          </h1>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <nav className="flex items-center gap-2">
            <NavLink to="/dashboard" className={linkStyles}>
              Dashboard
            </NavLink>
            <NavLink to="/leads/new" className={linkStyles}>
              Add Lead
            </NavLink>
          </nav>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-2">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{user?.email}</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
