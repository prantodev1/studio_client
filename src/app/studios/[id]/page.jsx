
"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

function StudioDetailsContent() {
  const { id } = useParams();
  const router = useRouter();

  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const response = await fetch(`${API_URL}/studios/${id}`);

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Studio not found");
        }

        setStudio(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudio();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400" />
          <p className="mt-4 font-medium text-slate-600 dark:text-slate-300">
            Loading studio...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <p className="text-center font-medium text-red-500 dark:text-red-400">
          {error}
        </p>
      </main>
    );
  }

  if (!studio) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <p className="text-center font-medium text-slate-600 dark:text-slate-300">
          Studio not found.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 transition-colors duration-300 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Studio Image */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {studio.image ? (
            <img
              src={studio.image}
              alt={studio.title}
              className="h-72 w-full object-cover sm:h-96"
            />
          ) : (
            <div className="flex h-72 items-center justify-center bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400 sm:h-96">
              No Image Available
            </div>
          )}
        </div>

        {/* Studio Details */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          {/* Main Information */}
          <div className="space-y-7 lg:col-span-2">

            <div>
              <span className="inline-flex rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300">
                {studio.category}
              </span>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {studio.title}
              </h1>

              <p className="mt-3 text-slate-500 dark:text-slate-400">
                📍 {studio.location}
              </p>

              <p className="mt-5 text-2xl font-extrabold text-blue-700 dark:text-blue-400">
                ৳{Number(studio.hourlyRate).toLocaleString()}
                <span className="ml-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                  / hour
                </span>
              </p>
            </div>

            {/* Overview */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                About This Studio
              </h2>

              <p className="mt-4 whitespace-pre-line leading-7 text-slate-600 dark:text-slate-300">
                {studio.overview || "No overview available."}
              </p>
            </section>

            {/* Studio Information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-white">
                Studio Information
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    label: "Security Deposit",
                    value: `৳${Number(studio.securityDeposit || 0).toLocaleString()}`,
                  },
                  {
                    label: "Maximum Capacity",
                    value: `${studio.maxCapacity} people`,
                  },
                  {
                    label: "Opening Time",
                    value: studio.openingTime || "Not specified",
                  },
                  {
                    label: "Closing Time",
                    value: studio.closingTime || "Not specified",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70"
                  >
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {item.label}
                    </p>

                    <p className="mt-2 font-bold text-slate-800 dark:text-slate-100">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Amenities */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-white">
                Amenities
              </h2>

              <div className="flex flex-wrap gap-3">
                {studio.amenities?.length > 0 ? (
                  studio.amenities.map((item, index) => (
                    <span
                      key={index}
                      className="rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 dark:bg-blue-400/10 dark:text-blue-300"
                    >
                      ✓ {item}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No amenities listed.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Booking Card */}
          <aside>
            <div className="sticky top-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Starting Price
              </p>

              <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                ৳{Number(studio.hourlyRate).toLocaleString()}
                <span className="ml-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                  / hour
                </span>
              </p>

              <div className="my-6 border-t border-slate-100 dark:border-slate-800" />

              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>📍 {studio.location}</p>
                <p>👥 Capacity: {studio.maxCapacity} people</p>
                <p>🕒 {studio.openingTime || "Not specified"} - {studio.closingTime || "Not specified"}</p>
              </div>

              <button
                onClick={() => {
                  if (!session?.user) {
                    router.push("/login");
                    return;
                  }

                  router.push(
                    `/booking?studioId=${studio._id}&hourlyRate=${studio.hourlyRate}`
                  );
                }}
                disabled={isPending}
                className="mt-7 w-full rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Checking..." : "Book Now"}
              </button>

              <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
                Secure your creative space today.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function StudioDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 dark:bg-slate-950">
          <p className="font-medium text-slate-600 dark:text-slate-300">
            Loading studio details...
          </p>
        </main>
      }
    >
      <StudioDetailsContent />
    </Suspense>
  );
}
