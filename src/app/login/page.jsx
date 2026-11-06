
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });



  const getRedirectPath = () => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");

    // Only allow internal application routes
    if (redirect?.startsWith("/") && !redirect.startsWith("//")) {
      return redirect;
    }

    return "/";
  };




  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error: authError } =
        await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
        });

      if (authError) {
        toast.error(
          authError.message || "Login failed. Please try again."
        );
        return;
      }

      if (data) {
        await authClient.getSession();

        toast.success("Login successful! Welcome to StudioSpace.");

        const redirectPath = getRedirectPath();

        router.replace(redirectPath);
        router.refresh();
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };


const handleGoogleLogin = async () => {
  try {
    setGoogleLoading(true);

    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL: getRedirectPath(),
      errorCallbackURL: "/login",
    });

    console.log("Google Login Result:", result);

    if (result.error) {
      toast.error(
        result.error.message || "Google login failed."
      );
      setGoogleLoading(false);
      return;
    }

  } catch (err) {
    console.error("Google Login Error:", err);
    toast.error(err.message || "Google login failed.");
    setGoogleLoading(false);
  }
};


  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 transition-colors duration-300 dark:bg-slate-950 sm:px-6">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 sm:p-10">

        {/* Heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-3xl dark:bg-indigo-500/15">
            🎬
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-slate-400">
            Login to your StudioSpace account and continue your creative journey.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300"
            >
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3.5 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login to Your Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200 dark:bg-slate-700" />
          <span className="text-xs font-medium uppercase text-gray-400">
            Or continue with
          </span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-slate-700" />
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <svg
            viewBox="0 0 48 48"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.02 13.22l7.98 6.19C12.9 13.72 18.02 9.5 24 9.5Z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.75 7.18l7.27 5.64c4.24-3.91 6.52-9.67 6.52-17.29Z" />
            <path fill="#FBBC05" d="M10.99 28.59A14.4 14.4 0 0 1 10.23 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.86.92 7.52 2.55 10.78l8.44-6.19Z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.14 15.91-5.82l-7.27-5.64c-2.02 1.35-4.6 2.15-8.64 2.15-5.98 0-11.1-4.22-13-9.9l-8.44 6.19C6.51 43.62 14.62 48 24 48Z" />
          </svg>

          {googleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        {/* Register Link */}
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-slate-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-indigo-600 transition hover:text-indigo-700 hover:underline dark:text-indigo-400"
          >
            Create an account
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-gray-400 dark:text-slate-500">
          © 2026 StudioSpace. All rights reserved.
        </p>
      </div>
    </main>
  );
}
