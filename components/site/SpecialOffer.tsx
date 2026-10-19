"use client";
import { ArrowRight, Check, Flame } from "lucide-react";
import Image from "next/image";

export function SpecialOffer() {
  return (
    <section className="relative py-8 lg:py-12 overflow-hidden">
      {/* Soft lavender-to-white gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-lavender-100" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-900/10 overflow-hidden border border-white/50">
          {/* Content */}
          <div className="flex flex-col lg:flex-row items-stretch">
            {/* Left side - Content */}
            <div className="w-full lg:w-[55%] p-6 lg:p-8 flex flex-col justify-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-semibold w-fit mb-4 shadow-lg shadow-purple-500/30">
                <Flame className="w-3.5 h-3.5" />
                Special Pricing
              </div>

              {/* Headline */}
              <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight text-gray-900 mb-3">
                Transform Your Body & Mind
              </h2>

              <p className="text-sm lg:text-base text-gray-600 mb-5 max-w-xl leading-relaxed">
                Join thousands of students in our premium yoga program designed for real results. Expert-led classes, flexible schedules, and proven transformations.
              </p>

              {/* Pricing Section */}
              <div className="flex flex-wrap items-end gap-4 lg:gap-6 mb-5">
                {/* 1 Month */}
                <div className="flex-1 min-w-[130px]">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">1 Month</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-gray-400 line-through text-sm">₹999</span>
                    <span className="font-display font-bold text-3xl text-gray-900">₹699</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Standard</div>
                </div>

                {/* 3 Months */}
                <div className="flex-1 min-w-[130px]">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">3 Months</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-gray-400 line-through text-sm">₹1999</span>
                    <span className="font-display font-bold text-3xl text-purple-700">₹1100</span>
                  </div>
                  <div className="text-xs text-purple-600 font-semibold mt-1">Popular</div>
                </div>

                {/* 6 Months */}
                <div className="flex-1 min-w-[130px]">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">6 Months</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-gray-400 line-through text-sm">₹2999</span>
                    <span className="font-display font-bold text-3xl bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">₹1499</span>
                  </div>
                  <div className="text-xs text-purple-600 font-semibold mt-1">Best Value</div>
                </div>
              </div>

              {/* Benefits List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {[
                  "Live Interactive Yoga Classes",
                  "Fat Loss & Flexibility Training",
                  "Certified Yoga Trainers",
                  "Recorded Sessions Included"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-gray-700 text-xs font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Urgency Indicator */}
              <div className="flex items-center gap-2 mb-4 text-orange-600 font-semibold text-sm">
                <Flame className="w-4 h-4" />
                <span>Limited Seats Available</span>
              </div>

              {/* CTA Button */}
              <a
                href="/courses/yoga"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm font-semibold hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 w-fit"
              >
                Enroll Now
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Right side - Yoga Image */}
            <div className="w-full lg:w-[45%] relative min-h-[280px] lg:min-h-auto bg-gradient-to-br from-purple-100 via-purple-50 to-pink-100">
              <div className="relative h-[350px] sm:h-[400px] lg:h-full flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src="/assets/summer-offer.jpg"
                    alt="Yoga Classes"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
