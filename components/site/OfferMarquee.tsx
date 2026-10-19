export function OfferMarquee() {
  const offerText = "🎉 Special Offer: Yoga @ ₹699 (1 Mo) / ₹1100 (3 Mo) / ₹1499 (6 Mo)";
  
  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-background/95 backdrop-blur-md border-b border-primary/20 overflow-hidden py-1.5 md:py-2">
      <div className="marquee-container">
        <div className="marquee-content">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className="inline-flex items-center gap-2 text-foreground font-medium text-xs md:text-sm whitespace-nowrap px-6">
              {offerText}
              <a 
                href="#courses" 
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/20 hover:bg-primary/30 border border-primary/40 rounded-full transition-all text-[10px] md:text-xs font-semibold text-primary"
              >
                Enroll Now
              </a>
            </span>
          ))}
        </div>
      </div>
      
      <style>{`
        .marquee-container {
          display: flex;
          overflow: hidden;
          user-select: none;
        }
        
        .marquee-content {
          display: flex;
          animation: marquee 30s linear infinite;
          will-change: transform;
        }
        
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .marquee-content:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
