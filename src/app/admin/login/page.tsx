"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://subhashreebhawan-api.vercel.app/api";

  // ========================================
  // CHECK EXISTING LOGIN
  // ========================================

  useEffect(() => {
    const token = localStorage.getItem(
      "subhashree_admin_token"
    );

    if (token) {
      router.replace("/admin");
    }
  }, [router]);

  // ========================================
  // LOGIN
  // ========================================

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
          "Unable to login. Please try again."
        );

        return;
      }

      // ======================================
      // SAVE LOGIN
      // ======================================

      localStorage.setItem(
        "subhashree_admin_token",
        data.token
      );

      localStorage.setItem(
        "subhashree_admin",
        JSON.stringify(data.admin)
      );

      setMessage("Login successful.");

      router.push("/admin");
    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f5f1] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* ===================================
            BRAND
        =================================== */}

        <div className="text-center mb-8">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1e293b] text-white shadow-lg">
            <span className="text-xl font-bold">
              SB
            </span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Subhashree Bhawan
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Administration Portal
          </p>
        </div>

        {/* ===================================
            LOGIN CARD
        =================================== */}

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-8">
          <div className="mb-7">
            <h2 className="text-xl font-semibold text-slate-900">
              Admin Login
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Sign in to manage buildings,
              floors, tenants and gallery
              content.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
            {/* EMAIL */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
                placeholder="admin@gmail.com"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            {/* PASSWORD */}

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition hover:text-slate-900"
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>
            </div>

            {/* ERROR */}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* SUCCESS */}

            {message && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </div>
            )}

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Subhashree Bhawan Administration
        </p>
      </div>
    </main>
  );
}