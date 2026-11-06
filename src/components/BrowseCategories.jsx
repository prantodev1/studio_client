
import Link from "next/link";

const categories = [
  {
    name: "Photo Studio",
    description: "Professional spaces for photography and creative shoots.",
    icon: "📸",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Film Stage",
    description: "Production-ready spaces for filmmaking and video projects.",
    icon: "🎬",
    color: "from-purple-500 to-indigo-500",
  },
  {
    name: "Podcast Lounge",
    description: "Comfortable recording spaces for podcasts and interviews.",
    icon: "🎙️",
    color: "from-orange-500 to-amber-500",
  },
  {
    name: "Music Suite",
    description: "Creative recording spaces for musicians and producers.",
    icon: "🎵",
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "Workshop",
    description: "Inspiring spaces for art, crafts and creative learning.",
    icon: "🎨",
    color: "from-emerald-500 to-teal-500",
  },
];

export default function BrowseCategories() {
  return (
    <section className="bg-white px-4 py-16 transition-colors duration-300 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[3px] text-blue-600 dark:text-blue-400">
            Explore By Category
          </p>

          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Browse Studio Categories
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-slate-400">
            Find the perfect creative environment for your next big idea.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/studios?category=${encodeURIComponent(category.name)}`}
              className="group rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center transition duration-300 hover:-translate-y-2 hover:border-blue-300 hover:bg-blue-50 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500 dark:hover:bg-slate-800"
            >
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} text-3xl shadow-lg transition duration-300 group-hover:scale-110`}
              >
                {category.icon}
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900 dark:text-white">
                {category.name}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-400">
                {category.description}
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                Explore Now <span>→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
