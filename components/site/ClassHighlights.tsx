"use client";

import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Instagram, GraduationCap, ExternalLink } from "lucide-react";

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

export function ClassHighlights() {
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
      currentVideo.play().catch(() => { });
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
    <section className="relative py-6 lg:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl glass-strong p-6 sm:p-8 lg:p-10 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">Students Feedback</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {HIGHLIGHT_VIDEOS.map((video) => {
              const isPlayingWithSound = activeVideoId === video.id && !isMuted[video.id];

              return (
                <div
                  key={video.id}
                  onClick={() => handleVideoClick(video.id)}
                  className="group relative rounded-2xl overflow-hidden glass border border-white/10 hover:border-primary/50 shadow-xl hover:shadow-purple-500/30 transition-all duration-300 cursor-pointer aspect-[4/5] h-[380px] sm:h-[400px] lg:h-[440px] mx-auto w-full"
                >
                  <video
                    ref={(el) => {
                      videoRefs.current[video.id] = el;
                    }}
                    src={video.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />

                  {/* Video overlay controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                    {/* Top controls: Mute/Unmute toggle */}
                    <div className="flex justify-end items-center">
                      <button
                        type="button"
                        onClick={(e) => toggleMute(e, video.id)}
                        className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 transition-transform hover:scale-110"
                        title={isMuted[video.id] ? "Unmute sound" : "Mute sound"}
                      >
                        {isMuted[video.id] ? (
                          <VolumeX className="w-4 h-4 text-red-400" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-green-400" />
                        )}
                      </button>
                    </div>

                    {/* Center Play/Pause indicator */}
                    <div className="self-center my-auto">
                      <div
                        className={`p-5 rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-md transition-all duration-300 transform ${isPlayingWithSound
                          ? "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                          : "opacity-100 scale-100"
                          }`}
                      >
                        {isPlayingWithSound ? (
                          <Pause className="w-7 h-7 fill-white" />
                        ) : (
                          <Play className="w-7 h-7 fill-white ml-0.5" />
                        )}
                      </div>
                    </div>

                    {/* Bottom status */}
                    <div className="text-left">
                      <p className="text-xs text-white/90 font-medium drop-shadow">
                        {isPlayingWithSound
                          ? "🔊 Playing with Sound (Click to pause)"
                          : "🔇 Click to play with sound"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Students Feedback Button on Instagram */}
          <div className="mt-8 flex justify-center">
            <a
              href="https://www.instagram.com/navigate_skill_academy/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white text-base font-semibold hover:opacity-95 hover:scale-105 transition-all shadow-lg hover:shadow-pink-500/25 border border-purple-400/20 cursor-pointer"
            >
              <Instagram className="w-5 h-5 text-white" />
              <span>View All Students Feedback</span>
              <ExternalLink className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
