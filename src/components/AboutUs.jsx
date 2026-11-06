
const features = [
  {
    icon: "🏢",
    title: "Quality Studio Spaces",
    description:
      "Discover creative spaces for photography, video production, events, and more.",
  },
  {
    icon: "📅",
    title: "Easy Online Booking",
    description:
      "Explore studios, choose your preferred schedule, and submit booking requests easily.",
  },
  {
    icon: "🔒",
    title: "Reliable Booking",
    description:
      "Track your booking requests and stay updated on their confirmation status.",
  },
];

export default function AboutUs() {
  return (
    <section
      id="about"
      className="scroll-mt-24 bg-white px-4 py-20 transition-colors duration-300 dark:bg-slate-950 sm:px-6"
    >
      <div className="mx-auto max-w-7xl">
        {/* About Content */}
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400">
              About StudioSpace
            </span>

            <h2 className="mt-5 text-3xl font-bold leading-tight text-gray-900 dark:text-white md:text-4xl">
              Your Space, Your Creativity
            </h2>

            <p className="mt-5 leading-8 text-gray-600 dark:text-slate-400">
              StudioSpace connects creators and professionals
              with creative studio spaces. Whether you are a
              photographer, content creator, or event organizer,
              discover and book the perfect space for your next project.
            </p>

            <p className="mt-4 leading-8 text-gray-600 dark:text-slate-400">
              Our mission is to make finding and booking creative
              spaces simple, convenient, and accessible.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                Creative Spaces
              </span>

              <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                Easy Booking
              </span>

              <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                Trusted Platform
              </span>
            </div>
          </div>

          {/* Creative Banner */}
          <div className="flex min-h-80 items-center justify-center overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-10 transition-colors duration-300 dark:border-slate-800 dark:from-indigo-950 dark:via-slate-900 dark:to-purple-950">
            <div className="text-center">
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-white text-7xl shadow-lg dark:bg-slate-800">
                🎬
              </div>

              <h3 className="mt-7 text-2xl font-bold text-indigo-700 dark:text-indigo-400">
                Create Without Limits
              </h3>

              <p className="mt-3 leading-7 text-gray-600 dark:text-slate-400">
                Find the space that inspires your creativity.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Why Choose Us
            </span>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              What Makes StudioSpace Special?
            </h2>

            <p className="mt-4 leading-7 text-gray-600 dark:text-slate-400">
              Everything you need to discover and book your ideal creative space.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/40"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-3xl transition-colors group-hover:bg-indigo-100 dark:bg-indigo-500/10 dark:group-hover:bg-indigo-500/20">
                  {feature.icon}
                </div>

                <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
