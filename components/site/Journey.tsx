"use client";
import { Search, GraduationCap, TrendingUp, Trophy } from "lucide-react";

const steps = [
  { n: "01", icon: Search, title: "Choose Your Program", desc: "Pick what fits your lifestyle and goals." },
  { n: "02", icon: GraduationCap, title: "Learn from Experts", desc: "Live sessions and curated content by mentors." },
  { n: "03", icon: TrendingUp, title: "Transform Daily", desc: "Small habits, consistent action, real change." },
  { n: "04", icon: Trophy, title: "Achieve Balance", desc: "A stronger, happier, more focused you." },
];

export function Journey() {
  return (
    <section className="relative py-6 lg:py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center mb-6">
          <h2 className="font-display font-bold text-2xl lg:text-3xl text-foreground">
            Your <span className="text-gradient">Learning Journey</span>
          </h2>
          <p className="mt-2 text-xs lg:text-sm text-muted-foreground">
            Four simple steps to a transformed lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {steps.map((s) => (
            <div
              key={s.n}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-background/30 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all"
            >
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-3">
                <s.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>

              <div className="text-2xl lg:text-3xl font-display font-bold text-gradient mb-2">{s.n}</div>
              <h3 className="text-sm lg:text-base font-semibold text-foreground mb-1">{s.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
