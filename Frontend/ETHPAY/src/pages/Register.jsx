import { useState } from "react";
import Validator from "../utils/validator";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext"; 

export default function Register() {
  const { setUser } = useAuth(); 
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!Validator.isEmail(form.email)) {
      alert("Enter a valid email");
      return;
    }
    
    if (!Validator.isPasswordStrong(form.password)) {
      alert("Password must be at least 6 characters and contain a number");
      return;
    }

    setLoading(true);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    try {
      // 1. Register
    await api.post("user/register/", form);

    // 2. Login automatically
    const loginRes = await api.post("user/login/", {
      email: form.email,
      password: form.password,
    });

    // Save tokens in localStorage
    localStorage.setItem("access", loginRes.data.access);
    localStorage.setItem("refresh", loginRes.data.refresh);

    // Decode JWT to get role
    const tokenUser = JSON.parse(atob(loginRes.data.access.split(".")[1]));
    //console.log("JWT payload:", tokenUser);

    // **Update AuthContext state**
    setUser(tokenUser);

    // Redirect to role-based dashboard
    if (tokenUser.role === "ADMIN") navigate("/admin");
    else if (tokenUser.role === "MERCHANT") navigate("/merchant");
    else navigate("/dashboard");

    setLoading(false);
    } catch (err) {
        setError(JSON.stringify(err.response?.data));
        console.error("Register error:", err);
        setLoading(false);
    }
  };

  return (
    <PageWrapper title="Create Account">

      {error && (
        <div className="text-red-500 text-sm mb-2">
          {typeof error === "string" ? error : Object.entries(JSON.parse(error)).map(
            ([field, msgs]) => (
              <div key={field}>
                {field}: {msgs.join(", ")}
              </div>
            )
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          required
          disabled={loading}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          disabled={loading}
        />

        <select
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          disabled={loading}
        >
          <option value="CUSTOMER">End User</option>
          <option value="MERCHANT">Merchant</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }
          `}
        >
          {loading ? (
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block" />
           ) : (
            "Register"
           )}
        </button>
      </form>
    </PageWrapper>
  );
}
