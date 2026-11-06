
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";
import { toast } from "react-toastify";

function EditStudioForm() {
    const params = useParams();
    const id = params?.id;
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        hourlyRate: "",
        securityDeposit: "",
        maxCapacity: "",
        openingTime: "09:00",
        closingTime: "22:00",
        location: "",
        image: "",
        amenities: "",
        overview: "",
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (!id) return;

        const fetchStudio = async () => {
            if (!/^[0-9a-fA-F]{24}$/.test(id)) {
                setError("Invalid studio ID: " + id);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/studios/${id}`);
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Failed to fetch studio"
                    );
                }

                const studio = result.data;

                setFormData({
                    title: studio.title || "",
                    category: studio.category || "",
                    hourlyRate: studio.hourlyRate ?? "",
                    securityDeposit: studio.securityDeposit ?? "",
                    maxCapacity: studio.maxCapacity ?? "",
                    openingTime: studio.openingTime || "09:00",
                    closingTime: studio.closingTime || "22:00",
                    location: studio.location || "",
                    image: studio.image || "",
                    amenities: Array.isArray(studio.amenities)
                        ? studio.amenities.join(", ")
                        : "",
                    overview: studio.overview || "",
                });
            } catch (error) {
                setError(error.message);
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudio();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (submitting) return;

        setSubmitting(true);

        try {
            const tokenResponse = await authClient.token();
            const token = tokenResponse?.data?.token;

            if (tokenResponse?.error || !token) {
                throw new Error("Please login again!");
            }

            const response = await fetch(`${API_URL}/studios/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok || result.success === false) {
                throw new Error(
                    result.message || "Failed to update studio"
                );
            }

            toast.success("Studio updated successfully!");

            router.push("/my-listings");
            router.refresh();
        } catch (error) {
            console.error("Update studio error:", error);
            toast.error(error.message || "Something went wrong!");
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass =
        "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-900/40";

    const labelClass =
        "mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300";

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    <p className="text-gray-600 dark:text-slate-300">
                        Loading studio information...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto my-16 max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/40">
                <p className="font-medium text-red-600 dark:text-red-400">
                    {error}
                </p>
                <button
                    onClick={() => router.push("/my-listings")}
                    className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
                >
                    Back to My Listings
                </button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10 transition-colors duration-300 dark:bg-slate-950 sm:px-6">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Studio Management
                    </p>

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                        Edit Studio
                    </h1>

                    <p className="mt-2 text-gray-600 dark:text-slate-400">
                        Update your studio information and keep your listing
                        up to date.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 sm:p-8"
                >
                    <div>
                        <label className={labelClass}>Studio Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Studio Title"
                            required
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Category"
                            required
                            className={inputClass}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <label className={labelClass}>Hourly Rate</label>
                            <input
                                type="number"
                                name="hourlyRate"
                                value={formData.hourlyRate}
                                onChange={handleChange}
                                placeholder="Hourly Rate"
                                required
                                min="0"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>
                                Security Deposit
                            </label>
                            <input
                                type="number"
                                name="securityDeposit"
                                value={formData.securityDeposit}
                                onChange={handleChange}
                                placeholder="Security Deposit"
                                required
                                min="0"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Maximum Capacity</label>
                        <input
                            type="number"
                            name="maxCapacity"
                            value={formData.maxCapacity}
                            onChange={handleChange}
                            placeholder="Maximum Capacity"
                            required
                            min="1"
                            className={inputClass}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <label className={labelClass}>Opening Time</label>
                            <input
                                type="time"
                                name="openingTime"
                                value={formData.openingTime}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Closing Time</label>
                            <input
                                type="time"
                                name="closingTime"
                                value={formData.closingTime}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Studio Location"
                            required
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Image URL</label>
                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Amenities</label>
                        <input
                            type="text"
                            name="amenities"
                            value={formData.amenities}
                            onChange={handleChange}
                            placeholder="AC, WiFi, Parking (comma separated)"
                            className={inputClass}
                        />
                        <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
                            Separate multiple amenities with commas.
                        </p>
                    </div>

                    <div>
                        <label className={labelClass}>Studio Overview</label>
                        <textarea
                            name="overview"
                            value={formData.overview}
                            onChange={handleChange}
                            placeholder="Describe your studio..."
                            rows={5}
                            className={inputClass}
                        />
                    </div>

                    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? "Updating..." : "Update Studio"}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push("/my-listings")}
                            className="rounded-xl border border-gray-300 px-6 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default function EditStudioPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-[60vh] items-center justify-center text-gray-600 dark:text-slate-300">
                    Loading edit page...
                </div>
            }
        >
            <EditStudioForm />
        </Suspense>
    );
}
