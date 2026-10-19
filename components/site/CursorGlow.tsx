import { useEffect, useRef } from "react";
import { usePerformance } from "@/hooks/use-performance";

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const { reduceMotion, isLowEndDevice } = usePerformance();

  useEffect(() => {
    if (reduceMotion || isLowEndDevice) return; // Skip animation on low-end devices

    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;

    const move = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const tick = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      el.style.transform = `translate3d(${cx - 200}px, ${cy - 200}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion, isLowEndDevice]);

  if (reduceMotion || isLowEndDevice) return null; // Don't render on low-end devices

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[1] w-[300px] h-[300px] rounded-full opacity-30 mix-blend-screen hidden lg:block"
      style={{
        background:
          "radial-gradient(closest-side, rgba(168,85,247,0.25), rgba(217,70,239,0.08) 50%, transparent 70%)",
        willChange: "transform",
      }}
    />
  );
}
