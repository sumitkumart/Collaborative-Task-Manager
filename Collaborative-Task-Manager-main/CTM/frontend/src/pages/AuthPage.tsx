import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";

type Mode = "login" | "register";

const titles: Record<Mode, string> = {
  login: "Welcome back",
  register: "Join the workspace",
};

const cta: Record<Mode, string> = {
  login: "Log in",
  register: "Create account",
};

export const AuthPage = ({ mode }: { mode: Mode }) => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (mode === "login") {
        return authApi.login({ email: form.email, password: form.password });
      }
      return authApi.register(form);
    },
    onSuccess: (data) => {
      setUser(data.user);
      navigate("/");
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Try again.";
      setError(Array.isArray(message) ? message.join(", ") : message);
    },
  });

  const updateField = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 -top-10 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="absolute right-0 top-10 h-64 w-64 rounded-full bg-indigo-200/60 blur-3xl" />
        <div className="absolute bottom-0 right-16 h-52 w-52 rounded-full bg-cyan-200/50 blur-3xl" />
      </div>

      <div className="relative flex items-center justify-center px-4 py-14">
        <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-2">
          <div className="hidden lg:flex flex-col justify-between rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white p-10 shadow-2xl border border-white/10">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Collaborative Task Manager
              </p>
              <h1 className="text-4xl font-semibold leading-tight">
                Plan, assign, and ship with clarity.
              </h1>
              <p className="text-slate-300">
                Keep your team aligned with live status, instant assignments,
                and focused dashboards that surface what matters now.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-xs text-slate-200">Live updates</p>
                  <p className="text-lg font-semibold">Socket.io + JWT</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-xs text-slate-200">Security</p>
                  <p className="text-lg font-semibold">HttpOnly cookies</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 border border-white/30 shadow-md"
                  />
                ))}
              </div>
              <p className="text-sm text-slate-300">
                React, Express, MongoDB, Socket.io
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white/80 backdrop-blur shadow-xl border border-slate-100 p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-sky-600">
                  {mode === "login" ? "Secure login" : "Create your workspace"}
                </p>
                <h2 className="text-3xl font-semibold mt-1 text-slate-900">
                  {titles[mode]}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Continue to the real-time dashboard.
                </p>
              </div>
              <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                Team-ready
              </span>
            </div>

            <form
              className="mt-8 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setError(null);
                mutation.mutate();
              }}
            >
              {mode === "register" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Name
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none"
                    placeholder="Alex Doe"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none"
                  placeholder="team@workspace.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  required
                  type="password"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none"
                  placeholder="********"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white font-semibold shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:shadow-xl transition"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Please wait..." : cta[mode]}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-600">
              {mode === "login" ? "New here?" : "Already have an account?"}{" "}
              <Link
                to={mode === "login" ? "/register" : "/login"}
                className="font-semibold text-sky-700 hover:underline"
              >
                {mode === "login" ? "Create an account" : "Go to login"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
