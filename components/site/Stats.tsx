"use client";

const stats = [
  { label: "ACTIVE STUDENTS", value: "5k+" },
  { label: "EXPERT MENTORS", value: "50+" },
  { label: "LIVE CLASSES", value: "10k+" },
  { label: "RATING", value: "4.9/5" },
];

export function Stats() {
  return (
    <section className="relative py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((s) => (
            <div
              key={s.label}
              className="text-center group"
            >
              <div className="text-3xl md:text-4xl lg:text-5xl font-display font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                {s.value}
              </div>
              <div className="text-xs md:text-sm text-gray-600 font-semibold tracking-wider uppercase">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
