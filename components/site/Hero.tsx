"use client";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden h-screen lg:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3rem)] 2xl:h-[calc(100vh-3rem)] pt-0 pb-0 bg-gradient-to-t from-purple-100/70 via-purple-50/40 to-white lg:mt-[-40px]">
      {/* Light Clean Gradient Background */}
      <div className="absolute inset-0 -z-[1] bg-gradient-to-t from-purple-100/60 via-purple-50/30 to-white" />

      {/* Floating Badges */}
      <div className="absolute inset-0 -z-[1] overflow-hidden pointer-events-none">
        {/* Top left badge */}
        <div className="hidden sm:block absolute top-32 left-4 lg:left-16">
          <div className="px-4 py-2.5 rounded-xl bg-white border border-purple-200 shadow-md">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-semibold text-gray-800">10k+ Active Students</span>
            </div>
          </div>
        </div>

        {/* Top right badge */}
        <div className="hidden sm:block absolute top-36 right-4 lg:right-20">
          <div className="px-4 py-2.5 rounded-xl bg-[#692D96] shadow-md text-white">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-bold">4.9 Rating</span>
            </div>
          </div>
        </div>

        {/* Bottom left badge */}
        <div className="hidden sm:block absolute bottom-24 left-1/4">
          <div className="px-3.5 py-2 rounded-lg bg-white border border-purple-200 shadow-md">
            <span className="text-xs font-bold text-purple-700">50+ Expert Mentors</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl xl:max-w-8xl 2xl:max-w-9xl px-4 sm:px-6 lg:px-8 w-full h-full flex items-center">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[1fr_0.8fr] 2xl:grid-cols-[1fr_0.7fr] gap-6 lg:gap-12 xl:gap-16 2xl:gap-20 w-full py-4 lg:py-8 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left w-full flex flex-col justify-center items-center lg:items-start lg:pl-12 xl:pl-16">
            <p className="text-sm sm:text-base text-purple-700 font-bold uppercase tracking-wider mb-1 mt-1">
              Navigate Skill Academy
            </p>

            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-7xl leading-[1.2] text-gray-900 mb-4 max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl">
              Online <span className="bg-gradient-to-r from-[#692D96] via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">Yoga, Fitness</span> & Learning
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-4 lg:mb-6 font-medium">
              We understand the importance of approaching each work integrally and believe in the power of simple.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-row gap-3 sm:gap-4 items-center justify-center lg:justify-start w-full mb-4 lg:mb-6 flex-wrap sm:flex-nowrap">
              <a
                href="#courses"
                className="inline-flex items-center justify-center gap-2 w-[180px] sm:w-[200px] py-3 sm:py-3.5 rounded-full bg-[#692D96] text-white text-sm sm:text-base font-semibold shadow-md hover:bg-purple-800 transition-colors"
              >
                <span className="hidden sm:inline">Start Learning</span>
                <span className="sm:hidden">Start</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="/courses/yoga"
                className="inline-flex items-center justify-center gap-2 w-[180px] sm:w-[200px] py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-gray-800 rounded-full bg-white border border-purple-200 hover:bg-purple-50 shadow-xs transition-colors"
              >
                <span className="grid place-items-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-100 flex-shrink-0">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 text-purple-700 fill-purple-700 ml-0.5" />
                </span>
                <span className="hidden sm:inline whitespace-nowrap">Start Demo</span>
                <span className="sm:hidden text-sm whitespace-nowrap">Demo</span>
              </a>
            </div>

            {/* Social Proof Buttons */}
            <div className="flex flex-nowrap gap-2 justify-center lg:justify-start overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <a
                href="https://www.instagram.com/navigate_skill_academy/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white border border-purple-200 hover:bg-purple-50 transition-colors whitespace-nowrap flex-shrink-0 shadow-xs"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-gray-700 hidden sm:inline">Follow on Instagram</span>
              </a>

              <a
                href="https://www.bing.com/search?q=navigate+Skill+Academy+"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white border border-purple-200 hover:bg-purple-50 transition-colors whitespace-nowrap flex-shrink-0 shadow-xs"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-gray-700 hidden sm:inline">Highly Rated on Google</span>
              </a>
            </div>
          </div>

          {/* Right Image Container */}
          <div className="relative w-full flex justify-center items-center lg:mt-0">
            <div className="relative w-[240px] h-[300px] sm:w-[280px] sm:h-[340px] md:w-[320px] md:h-[380px] lg:w-[380px] lg:h-[420px] xl:w-[450px] xl:h-[500px] 2xl:w-[550px] 2xl:h-[600px]">
              
              {/* Soft flash-like radial color glow behind person (no hard border circle) */}
              <div 
                className="absolute w-[240px] h-[240px] sm:w-[290px] sm:h-[290px] md:w-[330px] md:h-[330px] lg:w-[400px] lg:h-[400px] xl:w-[460px] xl:h-[460px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.58)_0%,rgba(217,70,239,0.35)_45%,transparent_70%)] pointer-events-none"
              />

              {/* Yoga person image */}
              <div className="relative z-10 w-full h-full flex justify-center lg:block">
                <Image
                  src="/yoga/new_yoga_transparent.png"
                  alt="Yoga Classes"
                  className="w-full h-full object-contain lg:translateY-[-15px]"
                  loading="eager"
                  priority
                  fill
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
