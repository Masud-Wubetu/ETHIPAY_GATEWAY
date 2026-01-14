import { Link, NavLink, useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "../api/navConfig";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const canAccess = (roles) => {
    if (!roles) return true;        // public
    if (!user) return false;        // not logged in
    return roles.includes(user.role);
  };

  return (
    <nav className="w-full bg-indigo-600 text-white px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <div
        className="font-bold text-lg cursor-pointer"
        onClick={() => navigate("/")}
      >
        ETHPAY
      </div>

    

      {/* Navigation */}
      <div className="flex gap-6">
        {NAV_ITEMS.map(item => {
          const allowed = canAccess(item.roles);

          return (
            <NavLink
              key={item.to}
              to={allowed ? item.to : "/login"}
              className={({ isActive }) =>
                `${allowed ? "hover:underline" : "opacity-50 cursor-not-allowed"} 
                 ${isActive ? "font-semibold underline" : ""}`
              }
              onClick={(e) => {
                if (!allowed) {
                  e.preventDefault();
                  navigate("/login");
                }
              }}
            >
              {item.label}
            </NavLink>
          );
        })}
      </div>

        {user && (
        <Link
          to="/payments"
          className="hover:text-gray-200"
        >
          History
        </Link>
      )}


      {/* User actions */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm bg-white/20 px-3 py-1 rounded">
              {user.role}
            </span>
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className="bg-white text-indigo-600 px-3 py-1 rounded"
          >
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}
  
    