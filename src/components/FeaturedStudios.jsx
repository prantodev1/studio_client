
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FeaturedStudios() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedStudios = async () => {
      try {
       const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/studios/featured`
);

        if (!response.ok) {
          throw new Error("Failed to fetch featured studios");
        }

        const result = await response.json();

        setStudios(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedStudios();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading studios...</p>;
  }

  if (error) {
    return (
      <p className="text-center py-10 text-red-500">
        {error}
      </p>
    );
  }

  if (studios.length === 0) {
    return (
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-3">
          Featured Studios
        </h2>

        <p className="text-gray-500">
          No studios available yet. Check back soon!
        </p>
      </section>
    );
  }

 
return (
  <section className="max-w-7xl mx-auto px-4 py-16">
    <div className="text-center mb-10">
      <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-2">
        Explore Our Spaces
      </p>

      <h2 className="text-3xl md:text-4xl font-bold">
        Featured Studios
      </h2>

      <p className="text-gray-500 mt-3">
        Discover the perfect creative space for your next project.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
      {studios.map((studio) => (
        <div
          key={studio._id}
          className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300"
        >
          <div className="h-56 overflow-hidden">
            <img
              src={studio.image}
              alt={studio.title}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          </div>

          <div className="p-5">
            <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
              {studio.category}
            </span>

            <h3 className="text-xl font-bold mt-4">
              {studio.title}
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              📍 {studio.location}
            </p>

            <div className="flex items-center justify-between mt-5">
              <p className="font-bold text-lg">
                ৳{studio.hourlyRate}
                <span className="text-sm font-normal text-gray-500">
                  /hour
                </span>
              </p>


                <Link
  href={`/studios/${studio._id}`}
  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
>
  View Details
</Link>


              {/* <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                View Details
              </button> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

}
