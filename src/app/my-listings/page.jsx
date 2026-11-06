
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";
import Link from "next/link";
import { toast } from "react-toastify";

export default function MyListingsPage() {
    const { data: session, isPending } = authClient.useSession();
    const canAddStudio =
    session?.user?.role === "admin" ||
    (session?.user?.role === "sub-admin" &&
        session?.user?.permissions?.manageStudios === true);

    const [studios, setStudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    // Fetch My Listings
    useEffect(() => {
        if (isPending) return;

        if (!session?.user?.email) {
            setLoading(false);
            return;
        }

        const fetchMyListings = async () => {
            try {
                setLoading(true);
                setError("");

                const tokenResponse = await authClient.token();
                const token = tokenResponse?.data?.token;

                if (tokenResponse?.error || !token) {
                    throw new Error("Please login again!");
                }

                const response = await fetch(
                    `${API_URL}/studios/my-listings`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Failed to fetch listings"
                    );
                }

                setStudios(result.data || []);
            } catch (error) {
                console.error("Fetch listings error:", error);
                setError(error.message);
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMyListings();
    }, [session?.user?.email, isPending]);

    // Delete Studio
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this studio?"
        );

        if (!confirmDelete) return;

        try {
            setDeletingId(id);

            const tokenResponse = await authClient.token();
            const token = tokenResponse?.data?.token;

            if (tokenResponse?.error || !token) {
                throw new Error("Please login again!");
            }

            const response = await fetch(`${API_URL}/studios/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to delete studio"
                );
            }

            setStudios((prevStudios) =>
                prevStudios.filter(
                    (studio) => studio._id !== id
                )
            );

            toast.success("Studio deleted successfully!");
        } catch (error) {
            console.error("Delete studio error:", error);
            toast.error(error.message || "Failed to delete studio");
        } finally {
            setDeletingId(null);
        }
    };

    // Session Loading
    if (isPending || loading) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 transition-colors duration-300 dark:bg-slate-950">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    <p className="text-gray-600 dark:text-slate-300">
                        Loading your studios...
                    </p>
                </div>
            </main>
        );
    }

    // Login Required
    if (!session?.user) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 dark:bg-slate-950">
                <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Login Required
                    </h2>

                    <p className="mt-3 text-gray-600 dark:text-slate-400">
                        Please login to see your studio listings.
                    </p>

                    <Link
                        href="/login"
                        className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Login Now
                    </Link>
                </div>
            </main>
        );
    }

    // Error State
    if (error) {
        return (
            <main className="min-h-[60vh] bg-gray-50 px-4 py-16 dark:bg-slate-950">
                <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
                    <p className="font-medium text-red-600 dark:text-red-400">
                        {error}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10 transition-colors duration-300 dark:bg-slate-950 sm:px-6">
            <div className="mx-auto max-w-7xl">

                {/* Page Header */}
                <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            Studio Management
                        </p>

                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                            My Studio Listings
                        </h1>

                        <p className="mt-2 text-gray-600 dark:text-slate-400">
                            Manage and update all your studio listings.
                        </p>
                    </div>

                 {canAddStudio && (
    <Link
        href="/add-studio"
        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
    >
        + Add New Studio
    </Link>
)}
                </div>

                {/* Studio Count */}
                <div className="mb-7">
                    <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                        <span className="text-sm text-gray-600 dark:text-slate-400">
                            Total Studios:
                        </span>

                        <span className="font-bold text-blue-600 dark:text-blue-400">
                            {studios.length}
                        </span>
                    </div>
                </div>

                {/* Empty State */}
                {studios.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
                        <div className="mb-5 text-5xl">🏢</div>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            No Studios Yet
                        </h2>

                        <p className="mx-auto mt-3 max-w-md text-gray-600 dark:text-slate-400">
                            You haven't added any studios yet. Start by
                            creating your first studio listing.
                        </p>

                    {canAddStudio && (
    <Link
        href="/add-studio"
        className="mt-7 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
    >
        Add Your First Studio
    </Link>
)}
                    </div>
                ) : (
                    /* Studio Cards */
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {studios.map((studio) => (
                            <div
                                key={studio._id}
                                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                            >
                                {/* Studio Image */}
                                <div className="relative h-52 overflow-hidden bg-gray-200 dark:bg-slate-800">
                                    {studio.image ? (
                                        <img
                                            src={studio.image}
                                            alt={studio.title}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-gray-400 dark:text-slate-500">
                                            No Image Available
                                        </div>
                                    )}

                                    <span className="absolute left-4 top-4 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-blue-700 backdrop-blur dark:bg-slate-950/90 dark:text-blue-400">
                                        {studio.category}
                                    </span>
                                </div>

                                {/* Studio Information */}
                                <div className="p-5">
                                    <h2 className="line-clamp-1 text-xl font-bold text-gray-900 dark:text-white">
                                        {studio.title}
                                    </h2>

                                    <p className="mt-3 text-sm text-gray-600 dark:text-slate-400">
                                        📍 {studio.location}
                                    </p>

                                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-slate-800">
                                        <span className="text-sm text-gray-500 dark:text-slate-400">
                                            Hourly Rate
                                        </span>

                                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                            ৳{studio.hourlyRate} / hour
                                        </span>
                                    </div>

                                    {/* View Details */}
                                    <Link
                                        href={`/studios/${studio._id}`}
                                        className="mt-5 inline-block font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        View Details →
                                    </Link>

                                    {/* Actions */}
                                    <div className="mt-5 grid grid-cols-2 gap-3">
                                        <Link
                                            href={`/edit-studio/${studio._id}`}
                                            className="rounded-xl bg-blue-600 px-4 py-2.5 text-center font-semibold text-white transition hover:bg-blue-700"
                                        >
                                            Edit Studio
                                        </Link>

                                        <button
                                            onClick={() =>
                                                handleDelete(studio._id)
                                            }
                                            disabled={deletingId === studio._id}
                                            className="rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {deletingId === studio._id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
