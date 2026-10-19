"use client";
import { useRef } from "react";
import Link from "next/link";
import { Star, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const courses = [
  {
    title: "Online yoga classes",
    tag: "Yoga",
    mentor: "Bhardwaj sir",
    rating: 4.8,
    duration: "1, 3 and 6 month",
    price: "₹1100",
    img: "/assets/yogacard.png",
    available: true,
    slug: "yoga",
  },
  {
    title: "Mastering Stock Trading",
    tag: "Finance",
    mentor: "Rohan Mehta",
    rating: 4.9,
    duration: "12 weeks",
    price: "₹2,999",
    img: "/assets/course-trading.jpg",
    available: false,
    slug: "stock-trading",
  },
  {
    title: "Urban HipHop Choreography",
    tag: "Dance",
    mentor: "Aman Verma",
    rating: 4.9,
    duration: "10 weeks",
    price: "₹1,899",
    img: "/assets/course-hiphop.jpg",
    available: false,
    slug: "urban-hiphop",
  },
  {
    title: "Strength & Conditioning",
    tag: "Fitness",
    mentor: "Karan Singh",
    rating: 4.7,
    duration: "12 weeks",
    price: "₹2,499",
    img: "/assets/cat-fitness.jpg",
    available: false,
    slug: "strength-conditioning",
  },
  {
    title: "Contemporary Dance Pro",
    tag: "Dance",
    mentor: "Ritu Kapoor",
    rating: 4.8,
    duration: "9 weeks",
    price: "₹1,799",
    img: "/assets/cat-dance.jpg",
    available: false,
    slug: "contemporary-dance",
  },
];

export function FeaturedCourses() {
  const scroller = useRef<HTMLDivElement>(null);
  const displayCourses = courses;

  const scroll = (dir: -1 | 1) => {
    scroller.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section id="courses" className="relative py-6 lg:py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex items-end justify-between gap-6 mb-10 lg:mb-12">
          <div>
            <div className="inline-flex px-3 py-1 rounded-full glass text-xs text-primary-glow font-semibold mb-3">
              Explore
            </div>
            <h2 className="font-display font-bold text-3xl lg:text-4xl xl:text-5xl text-foreground">
              Top <span className="text-gradient">Courses</span>
            </h2>
            <p className="mt-2 text-sm lg:text-base text-muted-foreground">
              Explore our most popular programs
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                aria-label="Previous"
                onClick={() => scroll(-1)}
                className="grid place-items-center w-10 h-10 rounded-xl glass hover:bg-primary/20 hover:border-primary/50 transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <button
                aria-label="Next"
                onClick={() => scroll(1)}
                className="grid place-items-center w-10 h-10 rounded-xl glass hover:bg-primary/20 hover:border-primary/50 transition-all"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={scroller}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 lg:-mx-10 lg:px-10 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {displayCourses.map((c) => (
            <article
              key={c.title}
              className="group snap-start shrink-0 w-[300px] rounded-2xl bg-card/60 backdrop-blur-sm border border-primary/15 overflow-hidden transition-all duration-300"
            >
              <Link
                href={c.available ? `/courses/${c.slug || 'yoga'}` : "#"}
                className={c.available ? "" : "pointer-events-none"}
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={c.img}
                    alt={c.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700"
                    fill
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-gradient-primary text-xs font-bold text-white">
                    {c.tag}
                  </span>
                  {!c.available && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold shadow-lg">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-5">
                <h3 className="font-semibold text-base text-foreground line-clamp-2 min-h-[3rem]">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  by {c.mentor}
                </p>

                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-foreground">
                      {c.rating}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {c.duration}
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div className="font-display font-bold text-2xl text-green-600">
                    {c.price}
                  </div>
                  {c.available ? (
                    <Link
                      href={`/courses/${c.slug || 'yoga'}`}
                      className="px-5 py-2 rounded-xl bg-gradient-primary text-white text-sm font-semibold transition-transform hover:scale-105"
                    >
                      Enroll
                    </Link>
                  ) : (
                    <button
                      className="px-5 py-2 rounded-xl bg-gray-300 text-gray-500 cursor-not-allowed text-sm font-semibold"
                      disabled
                    >
                      Notify Me
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
