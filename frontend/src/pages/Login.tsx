import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, token } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from
    ?.pathname;

  useEffect(() => {
    if (token) {
      navigate(from || "/dashboard", { replace: true });
    }
  }, [from, navigate, token]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await api.post("/login", { email, password });
      login(response.data.data.token, response.data.data.user);
      navigate(from || "/dashboard", { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed.");
      } else {
        setError("Login failed.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden bg-slate-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
              Assignment Build
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">
              Professional lead management for modern sales teams.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
              Sign in to manage leads, filter the pipeline, update statuses, and
              export the visible dataset directly from the dashboard.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <InfoTile label="Auth" value="JWT based" />
            <InfoTile label="Roles" value="Admin, Sales" />
            <InfoTile label="Export" value="CSV ready" />
          </div>
        </section>

        <section className="p-8 sm:p-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-medium text-slate-500">Welcome back</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                Sign in to your account
              </h2>
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
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
                  placeholder="Enter your password"
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
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-600">
              Need an account?{" "}
              <Link className="font-medium text-slate-900 underline" to="/register">
                Register here
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

const InfoTile = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-base font-medium text-white">{value}</p>
    </div>
  );
};

export default Login;
