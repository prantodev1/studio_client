"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "image") {
      setImageError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, image, password } = formData;

    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain an uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain a lowercase letter.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    // Prevent registration with an invalid image URL
    if (image.trim() && imageError) {
      toast.error("Please provide a valid profile photo URL.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } =
        await authClient.signUp.email({
          name: name.trim(),
          email: email.trim(),
          password,
          image: image.trim() || undefined,
        });

      if (authError) {
        toast.error(authError.message || "Registration failed.");
        return;
      }

      if (data) {
        toast.success("Account created successfully!");

        router.push("/");
        router.refresh();
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const initial = formData.name.trim().charAt(0).toUpperCase() || "U";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 transition-colors duration-300 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">

        {/* Header */}
        <div className="mb-7 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Create Account
          </h1>

          <p className="text-sm text-gray-500 dark:text-slate-400">
            Join StudioSpace and discover creative workspaces.
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300"
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
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          {/* Profile Photo */}
          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              Profile Photo URL (Optional)
            </label>

            <input
              id="image"
              name="image"
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={formData.image}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
            />

            <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
              Paste an image URL to preview your profile photo.
            </p>
          </div>

          {/* Image Preview */}
          {formData.image.trim() && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-slate-300">
                Profile Photo Preview
              </p>

              <div className="flex items-center gap-4">
                {!imageError ? (
                  <img
                    src={formData.image}
                    alt="Profile preview"
                    onError={() => setImageError(true)}
                    onLoad={() => setImageError(false)}
                    className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md dark:border-slate-700"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600 dark:bg-red-500/10">
                    !
                  </div>
                )}

                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formData.name || "Your Name"}
                  </p>

                  <p className={`mt-1 text-xs ${
                    imageError
                      ? "text-red-500"
                      : "text-green-600 dark:text-green-400"
                  }`}>
                    {imageError ? "Image could not be loaded" : "Photo preview"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Default Avatar Preview */}
          {!formData.image.trim() && (
            <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
                {initial}
              </div>

              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formData.name || "Your Name"}
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                  Default profile avatar
                </p>
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
            />

            <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
              Include at least one uppercase and one lowercase letter.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-600 transition hover:text-blue-700 hover:underline dark:text-blue-400"
          >
            Login
          </Link>
        </p>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400 dark:text-slate-500">
          © 2026 StudioSpace. All rights reserved.
        </p>
      </div>
    </main>
  );
}