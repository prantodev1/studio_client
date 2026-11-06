
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const statusStyles = {
  pending:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20",
  confirmed:
    "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20",
  completed:
    "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-400/10 dark:text-blue-300 dark:ring-blue-400/20",
  cancelled:
    "bg-red-50 text-red-700 ring-red-200 dark:bg-red-400/10 dark:text-red-300 dark:ring-red-400/20",
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(bookingId);

      const tokenData = await authClient.token();
      const token = tokenData?.data?.token || tokenData?.token;

      if (!token) {
        throw new Error("Please log in first.");
      }

      const response = await fetch(
        `${API_URL}/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Cancellation failed.");
      }

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );

      toast.success("Booking cancelled successfully!");
    } catch (error) {
      toast.error(error.message || "Cancellation failed.");
    } finally {
      setCancellingId(null);
    }
  };

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const tokenData = await authClient.token();
        const token = tokenData?.data?.token || tokenData?.token;

        if (!token) {
          setError("Please log in to see your bookings.");
          return;
        }

        const response = await fetch(
          `${API_URL}/bookings/my-bookings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load bookings.");
        }

        setBookings(result.data || []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-500" />
          <p className="mt-4 font-medium text-slate-600 dark:text-slate-300">
            Loading your bookings...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 transition-colors duration-300 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[3px] text-blue-600 dark:text-blue-400">
              Your StudioSpace
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              My Bookings
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
              Manage your studio reservations and keep track of your bookings.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Explore Studios →
          </Link>
        </div>

        {/* Booking Summary */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Total Bookings",
              value: bookings.length,
              color: "text-blue-600 dark:text-blue-400",
              icon: "▣",
            },
            {
              label: "Pending",
              value: bookings.filter((b) => b.status === "pending").length,
              color: "text-amber-600 dark:text-amber-400",
              icon: "◷",
            },
            {
              label: "Confirmed",
              value: bookings.filter((b) => b.status === "confirmed").length,
              color: "text-emerald-600 dark:text-emerald-400",
              icon: "✓",
            },
            {
              label: "Completed",
              value: bookings.filter((b) => b.status === "completed").length,
              color: "text-indigo-600 dark:text-indigo-400",
              icon: "★",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {item.label}
                </span>
                <span className={`text-xl font-bold ${item.color}`}>
                  {item.icon}
                </span>
              </div>

              <p className={`mt-3 text-3xl font-extrabold ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Error */}
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            <h2 className="font-bold">Unable to load bookings</h2>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          /* Empty State */
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-4xl text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              ▣
            </div>

            <h2 className="mt-6 text-2xl font-extrabold text-slate-900 dark:text-white">
              No bookings yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-slate-500 dark:text-slate-400">
              You haven&apos;t booked any studios yet. Discover a creative space
              that fits your next project.
            </p>

            <Link
              href="/studios"
              className="mt-7 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
            >
              Find a Studio
            </Link>
          </div>
        ) : (
          /* Booking Cards */
          <div className="grid gap-6 md:grid-cols-2">
            {bookings.map((booking) => (
              <article
                key={booking._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/20"
              >
                <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />

                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Studio Reservation
                      </p>

                      <h2 className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
                        {booking.studioTitle || "Studio"}
                      </h2>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold capitalize ring-1 ${
                        statusStyles[booking.status] ||
                        "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="my-6 grid grid-cols-2 gap-4">
                    {[
                      {
                        label: "Booking Date",
                        value: booking.bookingDate,
                      },
                      {
                        label: "Duration",
                        value: `${booking.totalHours} hours`,
                      },
                      {
                        label: "Start Time",
                        value: booking.startTime,
                      },
                      {
                        label: "End Time",
                        value: booking.endTime,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70"
                      >
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {item.label}
                        </p>
                        <p className="mt-2 font-bold text-slate-800 dark:text-slate-100">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Total Price
                      </p>
                      <p className="mt-1 text-2xl font-extrabold text-blue-700 dark:text-blue-400">
                        ৳{Number(booking.totalPrice).toLocaleString()}
                      </p>
                    </div>

                    {["pending", "confirmed"].includes(booking.status) && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-600 dark:hover:text-white"
                      >
                        {cancellingId === booking._id
                          ? "Cancelling..."
                          : "Cancel Booking"}
                      </button>
                    )}
                  </div>

                  <p className="mt-5 break-all border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
                    Booking ID: {booking._id}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
