import { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Validator from "../utils/validator";
import { getRedirectPathByRole } from "../utils/roleRedirect";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Validator.isEmail(form.email)) {
      alert("Enter a valid email");
      return;
    }

    if (!Validator.isPasswordStrong(form.password)) {
      alert("Password must be at least 6 characters and contain a number");
      return;
    }

    setLoading(true);

    try {
      const success = await login(form); // login() returns true/false
      if (!success) throw new Error("Login failed");

      // decode token from localStorage
      const tokenUser = JSON.parse(atob(localStorage.getItem("access").split(".")[1]));
      // console.log("Decoded token:", tokenUser);

      // redirect based on role
      const redirectTo = getRedirectPathByRole(tokenUser.role);
      navigate(redirectTo);

    } catch (err) {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };


  return (
    <PageWrapper title="Login to ETHPAY">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
          disabled={loading}
        />

        <button
          type="submit"
          disabled={!form.email || !form.password}
          className={`w-full py-3 rounded-lg font-semibold transition
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }
          `}
        >
           {loading ? (
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block" />
           ) : (
            "Login"
           )}
        </button>
      </form>
    </PageWrapper>
  );
}
