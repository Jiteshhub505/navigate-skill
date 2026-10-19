import { usePerformance } from "@/hooks/use-performance";

export function Background() {
  const { reduceMotion, isLowEndDevice } = usePerformance();

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-background">
      <div className="absolute inset-0 grid-bg opacity-40" />
      {/* Simplified blobs - only show on larger screens and not on low-end devices */}
      {!isLowEndDevice && (
        <>
          <div
            className={`hidden md:block absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full blur-3xl opacity-30 ${!reduceMotion ? 'animate-blob' : ''}`}
            style={{ background: "radial-gradient(closest-side, #9333ea, transparent)" }}
          />
          <div
            className={`hidden lg:block absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 ${!reduceMotion ? 'animate-blob' : ''}`}
            style={{ background: "radial-gradient(closest-side, #d946ef, transparent)", animationDelay: "4s" }}
          />
        </>
      )}
    </div>
  );
}
