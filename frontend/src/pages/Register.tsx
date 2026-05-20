import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await api.post("/register", { email, password });
      login(response.data.data.token, response.data.data.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Registration failed.");
      } else {
        setError("Registration failed.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">Create account</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Start using the dashboard
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            New registrations are created as Sales users according to the backend
            role model.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            <span>Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
              placeholder="you@company.com"
            />
          </label>

          <label className="block space-y-2 text-sm font-medium text-slate-700">
            <span>Password</span>
            <input
              required
              minLength={7}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
              placeholder="Minimum 7 characters"
            />
          </label>

          {error ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="font-medium text-slate-900 underline" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
