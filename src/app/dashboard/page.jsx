"use client";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function DashboardPage() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const [successMessage, setSuccessMessage] = useState("");
    const [actionError, setActionError] = useState("");

    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [promotingId, setPromotingId] = useState(null);

    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);
    const [bookingsError, setBookingsError] = useState("");

    const [selectedUser, setSelectedUser] = useState(null);



    const [selectedPermissions, setSelectedPermissions] = useState({
        manageStudios: false,
        manageBookings: false,
        viewSales: false,
        manageUsers: false,
    });

    // const [promotingId, setPromotingId] = useState(null);
    // const [successMessage, setSuccessMessage] = useState("");
    // const [actionError, setActionError] = useState("");

    const fetchUsers = async () => {
        try {
            setUsersLoading(true);

            const tokenData = await authClient.token();
            const token = tokenData?.data?.token || tokenData?.token;

            if (!token) {
                throw new Error("Authentication token not found.");
            }

            const response = await fetch(`${API_URL}/admin/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to fetch users.");
            }

            setUsers(result.data);
            toast.success("Users loaded successfully!");
        } catch (error) {
            console.error("Fetch users error:", error);
            toast.error(error.message || "Failed to load users.");
        } finally {
            setUsersLoading(false);
        }
    };


    const fetchBookings = async () => {
        try {
            setBookingsLoading(true);
            setBookingsError("");

            const tokenData = await authClient.token();
            const token = tokenData?.data?.token || tokenData?.token;

            if (!token) {
                throw new Error("Authentication token not found.");
            }

            const response = await fetch(`${API_URL}/bookings/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to fetch bookings."
                );
            }

            setBookings(result.data);
        } catch (error) {
            setBookingsError(error.message);
        } finally {
            setBookingsLoading(false);
        }
    };


    const handleBookingStatus = async (bookingId, status) => {
        try {
            const tokenData = await authClient.token();
            const token = tokenData?.data?.token || tokenData?.token;

            if (!token) {
                throw new Error("Authentication token not found.");
            }

            const response = await fetch(

                `${API_URL}/bookings/${bookingId}/status`,

                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status }),
                }

            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to update booking status."
                );
            }

            // Refresh booking list after successful update
            await fetchBookings();

            toast.success(`Booking ${status} successfully!`);

        } catch (error) {
            console.error("Booking status update error:", error);
            setBookingsError(error.message);
            toast.error(error.message || "Failed to update booking status.");
        }
    };


    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const tokenData = await authClient.token();
                const token = tokenData?.data?.token || tokenData?.token;

                if (!token) {
                    throw new Error("Authentication token not found.");
                }

                const response = await fetch(`${API_URL}/admin/dashboard`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || "Failed to load dashboard.");
                }

                setDashboard(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return <div className="p-10 text-center">Loading dashboard...</div>;
    }

    if (error) {
        return (
            <div className="p-10 text-center text-red-500">
                {error}
            </div>
        );
    }

    const stats = dashboard.stats;
    const permissions = dashboard.permissions;


    const cards = [
        { title: "Total Users", value: stats.totalUsers },
        { title: "Total Studios", value: stats.totalStudios },
        { title: "Total Bookings", value: stats.totalBookings },
        { title: "Pending Bookings", value: stats.pendingBookings },
        { title: "Confirmed Bookings", value: stats.confirmedBookings },
        { title: "Completed Bookings", value: stats.completedBookings },
        { title: "Cancelled Bookings", value: stats.cancelledBookings },
        { title: "Total Revenue", value: `৳${stats.totalRevenue}` },
        { title: "Today's Sales", value: `৳${stats.todayRevenue}` },
        { title: "Monthly Revenue", value: `৳${stats.monthlyRevenue}` },
    ];




    const handlePromote = async () => {
        if (!selectedUser) return;

        try {
            setPromotingId(selectedUser._id);
            setActionError("");
            setSuccessMessage("");

            const tokenData = await authClient.token();
            const token = tokenData?.data?.token || tokenData?.token;

            const response = await fetch(`${API_URL}/admin/users/promote`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: selectedUser._id,
                    permissions: selectedPermissions,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to promote user");
            }

            setSuccessMessage(`${selectedUser.name} promoted to Sub-admin!`);
            setSelectedUser(null);

            await fetchUsers();

        } catch (error) {
            setActionError(error.message);
        } finally {
            setPromotingId(null);
        }
    };


    const handleUpdatePermissions = async () => {
        if (!selectedUser) return;

        try {
            setPromotingId(selectedUser._id);
            setActionError("");
            setSuccessMessage("");

            const tokenData = await authClient.token();
            const token = tokenData?.data?.token || tokenData?.token;

            const response = await fetch(
                `${API_URL}/admin/users/${selectedUser._id}/permissions`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        permissions: selectedPermissions,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to update permissions");
            }

            setSuccessMessage(
                `${selectedUser.name}'s permissions updated successfully!`
            );

            setSelectedUser(null);
            await fetchUsers();

        } catch (error) {
            setActionError(error.message);
        } finally {
            setPromotingId(null);
        }
    };


    const handleDemote = async (userId) => {
        try {
            setPromotingId(userId);
            setActionError("");

            const tokenData = await authClient.token();
            const token = tokenData?.data?.token || tokenData?.token;

            const response = await fetch(
                `${API_URL}/admin/users/${userId}/demote`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to demote user");
            }

            setSuccessMessage("Sub-admin demoted to User successfully!");

            await fetchUsers();

        } catch (error) {
            setActionError(error.message);
        } finally {
            setPromotingId(null);
        }
    };


    return (
        <main className="min-h-screen bg-gray-50 p-4 transition-colors duration-300 dark:bg-slate-950 sm:p-6">
            <div className="mx-auto max-w-7xl space-y-8">

                {successMessage && (
                    <p className="rounded-lg bg-green-100 p-3 text-green-700">
                        {successMessage}
                    </p>
                )}

<section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900 sm:p-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        {/* Welcome Content */}
        <div>
            <span className="mb-3 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                ✨ Admin Panel
            </span>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-600 dark:text-slate-300 sm:text-base">
                Welcome back,{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {dashboard.admin.name}
                </span>
                ! 👋
            </p>

            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                Manage your platform, monitor activities, and keep everything running smoothly.
            </p>
        </div>

        {/* Admin Information */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-400">
                Logged in as
            </p>

            <p className="mt-1 break-all text-sm font-semibold text-gray-800 dark:text-white">
                {dashboard.admin.email}
            </p>

            <span className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold capitalize text-green-700 dark:bg-green-500/10 dark:text-green-400">
                {dashboard.admin.role}
            </span>
        </div>

    </div>
</section>

                <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => (
                        <div
                            key={card.title}
                            className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                        >
                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                                {card.title}
                            </p>

                            <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
                                {card.value}
                            </h2>
                        </div>
                    ))}
                </section>


                <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="mb-2 text-xl font-bold text-gray-900">
                        Top 5 Studios
                    </h2>

                    <p className="mb-5 text-sm text-gray-500">
                        Studios ranked by booking activity.
                    </p>

                    {!dashboard.topStudios || dashboard.topStudios.length === 0 ? (
                        <p className="text-gray-500">No studio analytics available.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b text-gray-500">
                                        <th className="p-3">#</th>
                                        <th className="p-3">Studio Name</th>
                                        <th className="p-3">Total Bookings</th>
                                        <th className="p-3">Total Revenue</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {dashboard.topStudios.slice(0, 5).map((studio, index) => (
                                        <tr
                                            key={studio._id || index}
                                            className="border-b last:border-0"
                                        >
                                            <td className="p-3">{index + 1}</td>
                                            <td className="p-3 font-medium text-gray-900">
                                                {studio.studioTitle}
                                            </td>
                                            <td className="p-3">{studio.bookingCount}</td>
                                            <td className="p-3 font-semibold text-green-700">
                                                ৳{Number(studio.totalRevenue || 0).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>



                <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="mb-5 text-xl font-bold text-gray-900">
                        Recent Bookings
                    </h2>

                    {dashboard.recentBookings.length === 0 ? (
                        <p className="text-gray-500">No bookings found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b text-gray-500">
                                        <th className="p-3">Studio</th>
                                        <th className="p-3">Customer</th>
                                        <th className="p-3">Date</th>
                                        <th className="p-3">Amount</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {dashboard.recentBookings.map((booking) => (
                                        <tr
                                            key={booking._id}
                                            className="border-b border-gray-200 transition-colors last:border-0 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800/60"
                                        >
                                            <td className="p-3">{booking.studioTitle}</td>
                                            <td className="p-3">{booking.userEmail}</td>
                                            <td className="p-3">{booking.bookingDate}</td>
                                            <td className="p-3">৳{booking.totalPrice}</td>
                                            <td className="p-3 capitalize">{booking.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {permissions.manageBookings && (
                    <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Booking Management
                                </h2>

                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                    View and manage all customer bookings.
                                </p>
                            </div>

                            <button
                                onClick={fetchBookings}
                                disabled={bookingsLoading}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {bookingsLoading ? "Loading..." : "Load All Bookings"}
                            </button>
                        </div>

                        {bookingsError && (
                            <p className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
                                {bookingsError}
                            </p>
                        )}

                        {bookingsLoading ? (
                            <p className="text-gray-500">Loading bookings...</p>
                        ) : bookings.length === 0 ? (
                            <p className="text-gray-500">
                                No bookings loaded. Click Load All Bookings.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b text-gray-500">
                                            <th className="p-3">Studio</th>
                                            <th className="p-3">Customer</th>
                                            <th className="p-3">Date</th>
                                            <th className="p-3">Time</th>
                                            <th className="p-3">Hours</th>
                                            <th className="p-3">Price</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {bookings.map((booking) => (
                                            <tr
                                                key={booking._id}
                                                className="border-b last:border-0"
                                            >
                                                <td className="p-3">
                                                    {booking.studioTitle}
                                                </td>

                                                <td className="p-3">
                                                    {booking.userEmail}
                                                </td>

                                                <td className="p-3 whitespace-nowrap">
                                                    {booking.bookingDate}
                                                </td>

                                                <td className="p-3 whitespace-nowrap">
                                                    {booking.startTime}–{booking.endTime}
                                                </td>

                                                <td className="p-3">
                                                    {Number(booking.totalHours).toFixed(2)}
                                                </td>

                                                <td className="p-3 whitespace-nowrap">
                                                    ৳{booking.totalPrice}
                                                </td>

                                                <td className="p-3">
                                                    <span
                                                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${booking.status === "confirmed"
                                                            ? "bg-green-100 text-green-700"
                                                            : booking.status === "cancelled"
                                                                ? "bg-red-100 text-red-700"
                                                                : booking.status === "completed"
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : "bg-yellow-100 text-yellow-700"
                                                            }`}
                                                    >
                                                        {booking.status}
                                                    </span>
                                                </td>

                                                <td className="p-3">
                                                    <div className="flex flex-wrap gap-2">
                                                        {booking.status === "pending" && (
                                                            <>
                                                                <button
                                                                    onClick={() =>
                                                                        handleBookingStatus(booking._id, "confirmed")
                                                                    }
                                                                    className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                                                                >
                                                                    Confirm
                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        handleBookingStatus(booking._id, "cancelled")
                                                                    }
                                                                    className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        )}

                                                        {booking.status === "confirmed" && (
                                                            <>
                                                                <button
                                                                    onClick={() =>
                                                                        handleBookingStatus(booking._id, "completed")
                                                                    }
                                                                    className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                                                                >
                                                                    Complete
                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        handleBookingStatus(booking._id, "cancelled")
                                                                    }
                                                                    className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        )}

                                                        {(booking.status === "completed" ||
                                                            booking.status === "cancelled") && (
                                                                <span className="text-xs text-gray-400">
                                                                    No actions
                                                                </span>
                                                            )}
                                                    </div>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}


                {permissions.manageUsers && (
                    <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            {/* <h2 className="text-xl font-bold text-gray-900">
                                User Management
                            </h2>
                            <p className="text-sm text-gray-500">
                                Manage users and promote them to Sub-admin.
                            </p> */}
                            <div className="mb-5">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    User Management
                                </h2>

                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                    Manage users and promote them to Sub-admin.
                                </p>

                                {successMessage && (
                                    <p className="mt-3 text-sm text-green-600">
                                        {successMessage}
                                    </p>
                                )}

                                {actionError && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {actionError}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={fetchUsers}
                            className="mb-5 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Load Users
                        </button>

                        {usersLoading ? (
                            <p>Loading users...</p>
                        ) : users.length === 0 ? (
                            <p className="text-gray-500">Click Load Users to see users.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b text-gray-500">
                                            <th className="p-3">Name</th>
                                            <th className="p-3">Email</th>
                                            <th className="p-3">Role</th>
                                            <th className="p-3">Action</th>
                                        </tr>
                                    </thead>

                                    {selectedUser && (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                                            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                                                <h2 className="text-xl font-bold text-gray-900">
                                                    {selectedUser.role === "sub-admin"
                                                        ? "Edit Sub-admin Permissions"
                                                        : "Promote to Sub-admin"}
                                                </h2>

                                                <p className="mt-2 text-sm text-gray-600">
                                                    Select permissions for {selectedUser.name}
                                                </p>

                                                <div className="mt-5 space-y-4">
                                                    {[
                                                        ["manageStudios", "Manage Studios"],
                                                        ["manageBookings", "Manage Bookings"],
                                                        ["viewSales", "View Sales"],
                                                        ["manageUsers", "Manage Users"],
                                                    ].map(([key, label]) => (
                                                        <label key={key} className="flex items-center gap-3">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedPermissions[key]}
                                                                onChange={(e) =>
                                                                    setSelectedPermissions((prev) => ({
                                                                        ...prev,
                                                                        [key]: e.target.checked,
                                                                    }))
                                                                }
                                                                className="h-4 w-4"
                                                            />
                                                            <span className="text-gray-700">{label}</span>
                                                        </label>
                                                    ))}
                                                </div>

                                                {actionError && (
                                                    <p className="mt-4 text-sm text-red-600">{actionError}</p>
                                                )}

                                                <div className="mt-6 flex justify-end gap-3">
                                                    <button
                                                        onClick={() => setSelectedUser(null)}
                                                        className="rounded-lg border px-4 py-2 text-gray-700"
                                                    >
                                                        Cancel
                                                    </button>

                                                    <button
                                                        onClick={
                                                            selectedUser.role === "sub-admin"
                                                                ? handleUpdatePermissions
                                                                : handlePromote
                                                        }
                                                        disabled={promotingId === selectedUser._id}
                                                        className="rounded-lg bg-green-600 px-4 py-2 text-white disabled:opacity-50"
                                                    >
                                                        {promotingId === selectedUser._id
                                                            ? "Saving..."
                                                            : selectedUser.role === "sub-admin"
                                                                ? "Update Permissions"
                                                                : "Confirm"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user._id} className="border-b">
                                                <td className="p-3">{user.name}</td>
                                                <td className="p-3">{user.email}</td>
                                                <td className="p-3 capitalize">
                                                    {user.role || "user"}
                                                </td>
                                                <td className="p-3">
                                                    {(!user.role || user.role === "user") && (
                                                        <button
                                                            disabled={promotingId === user._id}
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setSelectedPermissions({
                                                                    manageStudios: false,
                                                                    manageBookings: false,
                                                                    viewSales: false,
                                                                    manageUsers: false,
                                                                });
                                                                setActionError("");
                                                                setSuccessMessage("");
                                                            }}
                                                            className="rounded-lg bg-green-600 px-3 py-2 text-white disabled:opacity-50"
                                                        >
                                                            Promote
                                                        </button>
                                                    )}

                                                    {user.role === "sub-admin" && (
                                                        <div className="flex flex-wrap gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedUser(user);
                                                                    setSelectedPermissions({
                                                                        manageStudios: user.permissions?.manageStudios === true,
                                                                        manageBookings: user.permissions?.manageBookings === true,
                                                                        viewSales: user.permissions?.viewSales === true,
                                                                        manageUsers: user.permissions?.manageUsers === true,
                                                                    });
                                                                    setActionError("");
                                                                    setSuccessMessage("");
                                                                }}
                                                                className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                                                            >
                                                                Edit Permissions
                                                            </button>

                                                            <button
                                                                onClick={() => handleDemote(user._id)}
                                                                disabled={promotingId === user._id}
                                                                className="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                                                            >
                                                                {promotingId === user._id ? "Demoting..." : "Demote"}
                                                            </button>
                                                        </div>
                                                    )}

                                                    {user.role === "admin" && (
                                                        <span className="text-blue-600">
                                                            Admin
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}

            </div>
        </main>
    );
}
