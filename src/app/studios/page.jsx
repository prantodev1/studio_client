
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

export default function StudiosPage() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");




  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const handleBookNow = (studio) => {
    const bookingUrl = `/booking?studioId=${studio._id}&hourlyRate=${studio.hourlyRate}`;

    if (isPending) return;

    if (!session?.user) {
      router.push(`/login?redirect=${encodeURIComponent(bookingUrl)}`);
      return;
    }

    router.push(bookingUrl);
  };



  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedCategory = params.get("category");

    if (selectedCategory) {
      setCategory(selectedCategory);
    }
  }, []);


  useEffect(() => {
    const fetchStudios = async () => {
      try {
        const response = await fetch(`${API_URL}/studios`);

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load studios.");
        }

        setStudios(result.data || []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudios();
  }, []);

  const categories = [
    "All",
    ...new Set([
      ...studios.map((studio) => studio.category).filter(Boolean),
      ...(category !== "All" ? [category] : []),
    ]),
  ];
  // console.log("Selected category:", category);
  // console.log(
  //   "Available categories:",
  //   [...new Set(studios.map((studio) => studio.category))]
  // );
  const filteredStudios = studios.filter((studio) => {
    const searchMatch =
      studio.title?.toLowerCase().includes(search.toLowerCase()) ||
      studio.location?.toLowerCase().includes(search.toLowerCase());

    const categoryMatch =
      category === "All" || studio.category === category;

    return searchMatch && categoryMatch;
  });



  // console.log("Selected:", category);
  // console.log(
  //   "Filtered:",
  //   studios
  //     .filter((studio) => studio.category === category)
  //     .map((studio) => ({
  //       title: studio.title,
  //       category: studio.category,
  //     }))
  // );



  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 dark:bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400" />
          <p className="mt-4 font-medium text-gray-600 dark:text-slate-300">
            Loading studios...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[70vh] bg-gray-50 px-4 py-20 text-center dark:bg-slate-950">
        <p className="font-medium text-red-500 dark:text-red-400">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 transition-colors duration-300 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[3px] text-blue-600 dark:text-blue-400">
            Discover Your Space
          </p>

          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Explore Studios
          </h1>

          <p className="mt-3 text-gray-600 dark:text-slate-400">
            Find the perfect creative space for your next project.
          </p>
        </div>

        {/* Search and Category Filter */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            placeholder="Search by studio name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {filteredStudios.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl dark:bg-blue-500/10">
              🔍
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-800 dark:text-white">
              No studios found
            </h2>

            <p className="mt-2 text-gray-500 dark:text-slate-400">
              Try another search or category.
            </p>
          </div>
        ) : (
          /* Studio Cards */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStudios.map((studio) => (
              <article
                key={studio._id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/30"
              >
                {studio.image ? (
                  <img
                    src={studio.image}
                    alt={studio.title}
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center bg-gray-200 text-gray-500 dark:bg-slate-800 dark:text-slate-400">
                    No Image Available
                  </div>
                )}

                <div className="p-5">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {studio.category}
                  </span>

                  <h2 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                    {studio.title}
                  </h2>

                  <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                    📍 {studio.location}
                  </p>

                  <p className="mt-4 text-lg font-extrabold text-gray-900 dark:text-white">
                    ৳{Number(studio.hourlyRate).toLocaleString()}
                    <span className="ml-1 text-sm font-medium text-gray-500 dark:text-slate-400">
                      / hour
                    </span>
                  </p>

                  <div className="mt-5 flex gap-3">
                    <Link
                      href={`/studios/${studio._id}`}
                      className="flex-1 rounded-xl border border-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400/10"
                    >
                      View Details
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleBookNow(studio)}
                      disabled={isPending}
                      className="flex-1 rounded-xl bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isPending ? "Checking..." : "Book Now"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
