"use client";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

const cats = [
  { title: "Yoga", desc: "Find flow, focus and inner balance.", img: "/assets/yogacard.webp" },
  { title: "Fitness", desc: "Build strength, stamina and confidence.", img: "/assets/cat-fitness.jpg" },
  { title: "Finance", desc: "Master trading, investing and wealth.", img: "/assets/cat-finance.jpg" },
  { title: "Dance", desc: "Express, energize and feel alive.", img: "/assets/cat-dance.jpg" },
];

export function Categories() {
  return (
    <section id="categories" className="relative py-24 lg:py-32 cv-auto">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header — CSS fade-in instead of Framer Motion */}
        <div
          style={{ animation: "fadeInUp 0.6s ease both" }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div className="max-w-2xl">
            <div className="inline-flex px-3 py-1 rounded-full glass text-xs text-primary-glow mb-4">
              Explore
            </div>
            <h2 className="font-display font-bold text-4xl lg:text-5xl">
              Pick Your <span className="text-gradient">Passion</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            Curated categories designed by world-class mentors to fit every lifestyle.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cats.map((c, i) => (
            <a
              key={c.title}
              href="#courses"
              style={{
                animation: "fadeInUp 0.6s ease both",
                animationDelay: `${i * 80}ms`,
              }}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden border border-primary/10 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
            >
              <Image
                src={c.img}
                alt={`${c.title} courses at Navigate Skill Academy`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                fill
              />
              {/* dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              {/* purple hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"
                   style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.6), rgba(217,70,239,0.3))" }} />

              {/* arrow */}
              <div className="absolute top-5 right-5 grid place-items-center w-11 h-11 rounded-full glass-strong group-hover:bg-gradient-primary group-hover:rotate-45 transition-all duration-300">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>

              <div className="absolute bottom-0 inset-x-0 p-6">
                <h3 className="font-display font-bold text-2xl text-white">{c.title}</h3>
                <p className="mt-1 text-sm text-white/70 line-clamp-2">{c.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
