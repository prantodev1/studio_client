
const steps = [
  {
    number: "01",
    title: "Explore Studios",
    description:
      "Browse our collection of creative studios and find the perfect space for your project.",
    icon: "🔍",
  },
  {
    number: "02",
    title: "Choose Your Schedule",
    description:
      "Select your preferred booking date, starting time, and ending time.",
    icon: "📅",
  },
  {
    number: "03",
    title: "Submit Your Booking",
    description:
      "Send your booking request and wait for the studio owner's confirmation.",
    icon: "📝",
  },
  {
    number: "04",
    title: "Enjoy Your Studio",
    description:
      "Once your booking is confirmed, get ready to enjoy your creative space.",
    icon: "🎉",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-gray-50 px-4 py-20 transition-colors duration-300 dark:bg-slate-950 sm:px-6"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-block rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold tracking-wide text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400">
            SIMPLE BOOKING PROCESS
          </span>

          <h2 className="mt-5 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            How It Works
          </h2>

          <p className="mt-4 leading-7 text-gray-600 dark:text-slate-400">
            Booking your perfect creative space is simple.
            Follow these four easy steps to get started.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-3xl transition-colors group-hover:bg-indigo-100 dark:bg-indigo-500/10 dark:group-hover:bg-indigo-500/20">
                  {step.icon}
                </div>

                <span className="text-4xl font-extrabold text-indigo-100 transition-colors group-hover:text-indigo-200 dark:text-slate-800 dark:group-hover:text-indigo-500/30">
                  {step.number}
                </span>
              </div>

              <h3 className="mt-7 text-xl font-bold text-gray-900 dark:text-white">
                {step.title}
              </h3>

              <p className="mt-3 leading-7 text-gray-600 dark:text-slate-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
