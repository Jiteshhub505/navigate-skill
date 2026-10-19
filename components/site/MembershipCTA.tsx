"use client";

import { useState, useRef } from "react";
import { Sparkles, Play, Pause, Volume2, VolumeX, Instagram, ExternalLink } from "lucide-react";
import Link from "next/link";

const HIGHLIGHT_VIDEOS = [
  {
    id: 1,
    src: "/assets/StorySaver.net-navigate_skill_academy-Video-1784626099209.mp4",
  },
  {
    id: 2,
    src: "/assets/StorySaver.net-navigate_skill_academy-Video-1784626155327.mp4",
  },
  {
    id: 3,
    src: "/assets/StorySaver.net-navigate_skill_academy-Video-1784626534187.mp4",
  },
  {
    id: 4,
    src: "/assets/video4.mp4",
  },
];

export function MembershipCTA() {
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState<{ [key: number]: boolean }>({
    1: true,
    2: true,
    3: true,
    4: true,
  });
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  const handleVideoClick = (id: number) => {
    const currentVideo = videoRefs.current[id];
    if (!currentVideo) return;

    if (activeVideoId === id && !currentVideo.paused && !currentVideo.muted) {
      // If already playing with sound, pause it
      currentVideo.pause();
      setActiveVideoId(null);
    } else {
      // Pause all other videos
      Object.keys(videoRefs.current).forEach((key) => {
        const vidKey = Number(key);
        const vid = videoRefs.current[vidKey];
        if (vid && vidKey !== id) {
          vid.pause();
          vid.muted = true;
        }
      });

      // Play selected video with volume
      currentVideo.muted = false;
      currentVideo.play().catch(() => {});
      setActiveVideoId(id);
      setIsMuted((prev) => ({ ...prev, [id]: false }));
    }
  };

  const toggleMute = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const video = videoRefs.current[id];
    if (!video) return;

    const newMutedState = !video.muted;
    video.muted = newMutedState;
    setIsMuted((prev) => ({ ...prev, [id]: newMutedState }));
  };

  return (
    <section className="relative py-6 lg:py-8">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-2xl glass-strong p-8 lg:p-12 text-center">
          {/* animated blobs */}
          <div
            className="hidden sm:block absolute -top-10 -left-10 w-[200px] h-[200px] rounded-full blur-3xl opacity-30 animate-blob"
            style={{ background: "radial-gradient(closest-side, #9333ea, transparent)" }}
          />
          <div
            className="hidden sm:block absolute -bottom-10 -right-10 w-[200px] h-[200px] rounded-full blur-3xl opacity-30 animate-blob"
            style={{
              background: "radial-gradient(closest-side, #d946ef, transparent)",
              animationDelay: "4s",
            }}
          />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-primary-glow mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Premium Membership
            </div>

            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-foreground">
              Unlock Your <span className="text-gradient">Potential</span>
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-sm lg:text-base text-muted-foreground">
              Join thousands of students transforming their lifestyle with Navigate Skill Academy.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/courses/yoga"
                className="group relative inline-flex items-center gap-2 px-6 py-2.5 lg:px-7 lg:py-3 rounded-xl bg-gradient-primary text-white text-sm font-semibold hover:scale-105 transition-all overflow-hidden"
              >
                <span className="relative z-10">Start Learning</span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700" />
              </Link>
              <a
                href="#courses"
                className="px-6 py-2.5 lg:px-7 lg:py-3 rounded-xl glass hover:border-primary/50 text-sm font-medium text-foreground transition-all"
              >
                View Courses
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}