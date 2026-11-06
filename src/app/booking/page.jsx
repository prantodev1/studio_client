"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

function BookingForm() {
  const searchParams = useSearchParams();

  const { data: session, isPending } = authClient.useSession();

  const studioId = searchParams.get("studioId") || "";
  const rateFromUrl = Number(searchParams.get("hourlyRate")) || 0;

  const [studio, setStudio] = useState(null);

  const hourlyRate = Number(studio?.hourlyRate) || rateFromUrl;
  const openingTime = studio?.openingTime || "";
  const closingTime = studio?.closingTime || "";

  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const router = useRouter();

  // Load the studio so the form can enforce its operating hours.
  useEffect(() => {
    if (!studioId) return;

    let cancelled = false;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/studios/${studioId}`)
      .then((response) => response.json())
      .then((result) => {
        if (!cancelled && result?.data) {
          setStudio(result.data);
        }
      })
      .catch(() => {
        // Keep the URL rate; the backend still enforces its own rules.
      });

    return () => {
      cancelled = true;
    };
  }, [studioId]);


  useEffect(() => {
  if (isPending) return;

  if (!session?.user) {
    const currentUrl =
      window.location.pathname + window.location.search;

    router.replace(
      `/login?redirect=${encodeURIComponent(currentUrl)}`
    );
  }
}, [session, isPending, router]);


  // Convert time to minutes
  const startMinutes = startTime
    ? Number(startTime.split(":")[0]) * 60 +
      Number(startTime.split(":")[1])
    : 0;

  const endMinutes = endTime
    ? Number(endTime.split(":")[0]) * 60 +
      Number(endTime.split(":")[1])
    : 0;

  // Studio operating hours in minutes
  const openingMinutes = openingTime
    ? Number(openingTime.split(":")[0]) * 60 +
      Number(openingTime.split(":")[1])
    : 0;

  const closingMinutes = closingTime
    ? Number(closingTime.split(":")[0]) * 60 +
      Number(closingTime.split(":")[1])
    : 0;

  // Calculate duration
  const totalHours =
    endMinutes > startMinutes
      ? (endMinutes - startMinutes) / 60
      : 0;

  // Calculate total price
  const totalPrice = totalHours * hourlyRate;

  // Today's date
  const today = new Date().toLocaleDateString("en-CA");

  // Booking Handler
  const handleBooking = async (event) => {
    event.preventDefault();

    setMessage("");
    setError(false);

    if (!studioId) {
      setError(true);
      setMessage(
        "Studio ID missing. Please open a studio and click Book Now."
      );
      return;
    }

    if (!hourlyRate || hourlyRate <= 0) {
      setError(true);
      setMessage(
        "Invalid studio hourly rate. Please reopen the studio page."
      );
      return;
    }

    if (!bookingDate) {
      setError(true);
      setMessage("Please select a booking date.");
      return;
    }

    if (bookingDate < today) {
      setError(true);
      setMessage("Please select a valid future date.");
      return;
    }

    if (!startTime || !endTime || endMinutes <= startMinutes) {
      setError(true);
      setMessage("End time must be later than start time.");
      return;
    }

    if (
      (openingTime && startMinutes < openingMinutes) ||
      (closingTime && endMinutes > closingMinutes)
    ) {
      setError(true);
      setMessage(
        `Booking must be within the studio's operating hours (${openingTime || "opening"} - ${closingTime || "closing"}).`
      );
      return;
    }

    setLoading(true);

try {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      studioId,
      bookingDate,
      startTime,
      endTime,
    }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Booking failed.");
  }

  // Success Toast
  toast.success("Booking request submitted successfully! 🎉");

  // Reset Form
  setBookingDate("");
  setStartTime("");
  setEndTime("");

  // Redirect to My Bookings
  router.push("/my-bookings");

} catch (err) {
  toast.error(
    err.message || "Something went wrong. Please try again."
  );
} finally {
  setLoading(false);
}
  };

  if (isPending || !session?.user) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center">
      <p className="font-medium text-slate-600 dark:text-slate-300">
        Checking authentication...
      </p>
    </main>
  );
}

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 transition-colors duration-300 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-8">

        {/* Heading */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
            Book a Studio
          </h1>

          <p className="text-slate-600 dark:text-slate-400">
            Choose your preferred date and time to book a studio.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            role="alert"
            className={`mb-6 rounded-xl border p-4 ${
              error
                ? "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300"
                : "border-green-200 bg-green-50 text-green-700 dark:border-green-400/20 dark:bg-green-400/10 dark:text-green-300"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleBooking} className="space-y-6">

          {/* Studio ID */}
          <div>
            <label
              htmlFor="studioId"
              className="mb-2 block font-semibold text-slate-700 dark:text-slate-200"
            >
              Studio ID
            </label>

            <input
              id="studioId"
              type="text"
              value={studioId}
              readOnly
              placeholder="Open a studio and click Book Now"
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              required
            />
          </div>

          {/* Hourly Rate */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-400/20 dark:bg-blue-400/10">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Studio Hourly Rate
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-700 dark:text-blue-400">
              ৳{Number(hourlyRate).toLocaleString()} / hour
            </p>

            {openingTime && closingTime && (
              <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                Bookable hours: {openingTime} - {closingTime}
              </p>
            )}
          </div>

          {/* Booking Date */}
          <div>
            <label
              htmlFor="bookingDate"
              className="mb-2 block font-semibold text-slate-700 dark:text-slate-200"
            >
              Booking Date
            </label>

            <input
              id="bookingDate"
              type="date"
              value={bookingDate}
              onChange={(event) =>
                setBookingDate(event.target.value)
              }
              min={today}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              required
            />
          </div>

          {/* Start and End Time */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            <div>
              <label
                htmlFor="startTime"
                className="mb-2 block font-semibold text-slate-700 dark:text-slate-200"
              >
                Start Time
              </label>

              <input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(event) =>
                  setStartTime(event.target.value)
                }
                min={openingTime || undefined}
                max={closingTime || undefined}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label
                htmlFor="endTime"
                className="mb-2 block font-semibold text-slate-700 dark:text-slate-200"
              >
                End Time
              </label>

              <input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(event) =>
                  setEndTime(event.target.value)
                }
                min={startTime || openingTime || undefined}
                max={closingTime || undefined}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>

          </div>

          {/* Total Calculation */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-400/20 dark:bg-blue-400/10">

            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Booking Duration
            </p>

            <p className="mt-2 text-xl font-bold text-blue-700 dark:text-blue-400">
              {totalHours > 0
                ? `${totalHours} hours`
                : "Select a valid time"}
            </p>

            <div className="my-4 border-t border-blue-200 dark:border-blue-400/20" />

            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Estimated Total Price
            </p>

            <p className="mt-2 text-2xl font-extrabold text-blue-700 dark:text-blue-400">
              ৳{totalPrice.toLocaleString()}
            </p>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>

        </form>
      </div>
    </main>
  );
}

// Main Booking Page
export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 dark:bg-slate-950">
          <p className="py-20 text-center font-medium text-slate-600 dark:text-slate-300">
            Loading booking form...
          </p>
        </main>
      }
    >
      <BookingForm />
    </Suspense>
  );
}
