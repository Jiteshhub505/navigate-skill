"use client";
import { Video, MessageCircle, UsersRound } from "lucide-react";
import Image from "next/image";

const items = [
  {
    icon: Video,
    title: "Live Interactive Sessions",
    desc: "Real-time classes with expert instructors.",
    image: "/assets/live.png",
  },
  {
    icon: MessageCircle,
    title: "Mentor Support",
    desc: "One-on-one mentorship to guide your journey.",
    image: "/assets/mentor.png",
  },
  {
    icon: UsersRound,
    title: "Community & Growth",
    desc: "Join a vibrant tribe of learners.",
    image: "/assets/community.webp",
  },
];

export function WhyChooseUs() {
  return (
    <section className="relative py-12 lg:py-16">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl lg:text-5xl text-foreground">
            Why Choose <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">NavigateSkills?</span>
          </h2>
          <p className="mt-3 text-base lg:text-lg text-muted-foreground">
            A premium learning experience engineered for serious transformation.
          </p>
        </div>

        {/* Three Cards with Photos - Purple theme */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {items.map((it) => (
            <div
              key={it.title}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-200"
            >
              {/* Image */}
              <div className="relative h-48 lg:h-56 overflow-hidden">
                <Image 
                  src={it.image} 
                  alt={it.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  fill
                />
                {/* Purple gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 via-purple-900/30 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm">
                <h3 className="text-lg lg:text-xl font-bold text-purple-900 mb-2">
                  {it.title}
                </h3>
                <p className="text-sm lg:text-base text-purple-700">
                  {it.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
