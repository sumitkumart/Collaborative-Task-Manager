import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => navigate("/login"),
  });

  return (
    <header className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white/90 px-5 py-4 shadow-lg backdrop-blur animate-card">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
          Collaborative Task Manager
        </p>
        <p className="text-lg font-semibold text-slate-900">
          Hi, {user?.name || "there"}!
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col text-right">
          <span className="text-sm font-semibold text-slate-800">
            {user?.name}
          </span>
          <span className="text-xs text-slate-500">{user?.email}</span>
        </div>
        <button
          onClick={() => mutateAsync()}
          disabled={isPending}
          className="rounded-xl bg-gradient-to-r from-slate-900 to-indigo-900 px-4 py-2 text-sm font-semibold text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg transition"
        >
          {isPending ? "Signing out..." : "Logout"}
        </button>
      </div>
    </header>
  );
};
