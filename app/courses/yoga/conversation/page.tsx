"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "init" | "batch" | "slot" | "name" | "phone" | "requirement" | "completed";

interface ChatMsg {
  id: string;
  from: "bot" | "user";
  text: string;
}

interface Particle {
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const WA_URL =
  "https://wa.me/919218187041?text=Hi%2C%20I%20have%20filled%20online%20yoga%20class%20form.%20Can%20I%20get%20more%20details%20%3F";

const BATCH_OPTIONS = [
  { id: "morning",   icon: "🌅", label: "Morning",   slots: ["6–7 AM", "8–9 AM"] },
  { id: "afternoon", icon: "☀️", label: "Afternoon",  slots: ["12–1 PM", "4–5 PM"] },
  { id: "evening",   icon: "🌙", label: "Evening",    slots: ["7–8 PM"] },
];

function ConfettiCanvas({ trigger }: { trigger: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (trigger === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    const colors = ["#C084FC", "#818CF8", "#F472B6", "#34D399", "#FBBF24", "#60A5FA"];

    let particles: Particle[] = Array.from({ length: 85 }).map(() => {
      const angle = Math.random() * 360;
      return {
        x: canvas.width / 2,
        y: canvas.height / 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 6,
        angle: angle,
        speed: Math.random() * 6 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 12 - 6,
        opacity: 1,
      };
    });

    let animId: number;
    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let active = false;
      particles.forEach(p => {
        const rad = (p.angle * Math.PI) / 180;
        p.x += Math.cos(rad) * p.speed;
        p.y -= Math.sin(rad) * p.speed - 0.2; // Gravity effect
        p.rotation += p.rotationSpeed;
        p.speed *= 0.98; // Air resistance
        p.opacity -= 0.008; // Fade out slowly

        if (p.y < canvas.height && p.x > 0 && p.x < canvas.width && p.opacity > 0) {
          active = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (active) {
        animId = requestAnimationFrame(update);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}

const PAGE_STYLES = `
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.55; }
          30%            { transform: translateY(-7px); opacity: 1; }
        }
        @keyframes pulsePath {
          to { stroke-dashoffset: -200; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(123,47,190,0.3); border-radius: 10px; }

        /* Double outline frame styling */
        .glass-window-frame {
          background: rgba(255, 255, 255, 0.35);
          border: 2px solid #2E1854;
          border-radius: 20px;
          padding: 4px;
          box-shadow: 8px 8px 0px rgba(46, 24, 84, 0.15);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          overflow: visible;
          transition: box-shadow 0.25s ease;
        }

        .glass-window-frame:hover {
          box-shadow: 12px 12px 0px rgba(46, 24, 84, 0.22);
        }

        .glass-window-inner {
          border: 1.5px solid #2E1854;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.28);
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        /* Control dots styling */
        .window-header {
          padding: 8px 12px 6px;
          display: flex;
          align-items: center;
          gap: 5px;
          border-bottom: 1.5px solid #2E1854;
          background: rgba(255, 255, 255, 0.2);
        }

        .dot-control {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 1px solid #2E1854;
        }
        .dot-red { background: #FF5F56; }
        .dot-yellow { background: #FFBD2E; }
        .dot-green { background: #27C93F; }

        /* Sharp diagonal light highlight */
        .glass-reflection {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0.18) 28%, rgba(255, 255, 255, 0) 28.1%);
          pointer-events: none;
          z-index: 8;
        }

        /* Double border/stroke effect from image */
        .window-outline-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100svh;
          padding: 20px;
          z-index: 10;
        }

        .main-window-container {
          width: 90%;
          max-width: 600px;
          height: 80vh;
          display: flex;
          flex-direction: column;
          z-index: 10;
        }

        @media (max-width: 1023px) {
          .window-outline-wrap {
            padding: 0 !important;
            height: 100svh !important;
          }
          .main-window-container {
            width: 100% !important;
            max-width: 100% !important;
            height: 100% !important;
            border-radius: 0px !important;
            border: none !important;
            box-shadow: none !important;
            background: rgba(255, 255, 255, 0.25) !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .main-window-container > .glass-window-inner {
            border: none !important;
            border-radius: 0px !important;
          }
        }

        @keyframes floatBlob1 {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          50%      { transform: translate(30px, -40px) rotate(45deg); }
        }
        @keyframes floatBlob2 {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          50%      { transform: translate(-30px, 40px) rotate(-45deg); }
        }
        .blob1 {
          position: absolute;
          top: 15%;
          left: 10%;
          width: 250px;
          height: 250px;
          border-radius: 40%;
          background: radial-gradient(circle, rgba(192, 132, 252, 0.22) 0%, rgba(192, 132, 252, 0) 70%);
          animation: floatBlob1 12s ease-in-out infinite;
          will-change: transform;
        }
        .blob2 {
          position: absolute;
          bottom: 15%;
          right: 10%;
          width: 280px;
          height: 280px;
          border-radius: 45%;
          background: radial-gradient(circle, rgba(129, 140, 248, 0.18) 0%, rgba(129, 140, 248, 0) 70%);
          animation: floatBlob2 15s ease-in-out infinite;
          will-change: transform;
        }
`;

let _id = 0;
const uid = () => `m${++_id}`;

// ─── Validation ───────────────────────────────────────────────────────────────

function validateName(raw: string): string | null {
  const v = raw.trim();
  if (v.length < 4 || !/^[A-Za-z\s]+$/.test(v))
    return "Please enter a valid name (minimum 4 letters, alphabets only)";
  return null;
}

function validatePhone(v: string): string | null {
  if (!/^[6-9]\d{9}$/.test(v))           return "Please enter a valid 10-digit Indian mobile number";
  if (/^(.)\1{9}$/.test(v))              return "Please enter a valid 10-digit Indian mobile number";
  if (v === "1234567890" || v === "9876543210") return "Please enter a valid 10-digit Indian mobile number";
  if (/^(.{2})\1{4}$/.test(v))           return "Please enter a valid 10-digit Indian mobile number";
  return null;
}

// ─── Bold-text renderer (**text** → <strong>) ─────────────────────────────────

function BotText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>
      )}
    </>
  );
}

// ─── Bot Avatar ───────────────────────────────────────────────────────────────

function BotAvatar() {
  return (
    <motion.div
      initial={{ scale: 0.8, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      style={{
        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
        background: "linear-gradient(135deg, #7B2FBE 0%, #C084FC 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 17, boxShadow: "0 2px 10px rgba(123,47,190,0.3)", marginTop: 2,
      }}
    >
      🧘
    </motion.div>
  );
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
      <BotAvatar />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{
          background: "rgba(255, 255, 255, 0.7)", border: "1px solid rgba(255, 255, 255, 0.4)",
          borderRadius: "18px 18px 18px 4px",
          padding: "13px 18px", display: "flex", gap: 5, alignItems: "center",
          boxShadow: "0 4px 15px rgba(123,47,190,0.04)",
          backdropFilter: "blur(10px)",
        }}
      >
        {[0, 1, 2].map(i => (
          <span
            key={i}
            style={{
              display: "block", width: 8, height: 8, borderRadius: "50%",
              background: "#C084FC",
              animation: `typingBounce 1.3s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

// ─── Chat Bubbles ─────────────────────────────────────────────────────────────

function BotBubble({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      style={{ display: "flex", alignItems: "flex-end", gap: 8 }}
    >
      <BotAvatar />
      <div
        style={{
          background: "rgba(255, 255, 255, 0.75)", border: "1px solid rgba(255, 255, 255, 0.5)",
          borderRadius: "18px 18px 18px 4px",
          padding: "12px 17px", maxWidth: "72%",
          fontSize: 15, color: "#1C1C1C", lineHeight: 1.55,
          boxShadow: "0 4px 15px rgba(123,47,190,0.04)",
          whiteSpace: "pre-line", wordBreak: "break-word",
          backdropFilter: "blur(12px)",
        }}
      >
        <BotText text={text} />
      </div>
    </motion.div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      style={{ display: "flex", justifyContent: "flex-end" }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #7B2FBE, #9B59B6)",
          borderRadius: "18px 18px 4px 18px",
          padding: "11px 17px", maxWidth: "65%",
          fontSize: 15, color: "#fff", lineHeight: 1.5,
          boxShadow: "0 6px 20px rgba(123,47,190,0.22)",
          wordBreak: "break-word",
        }}
      >
        {text}
      </div>
    </motion.div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div style={{ height: 4, background: "rgba(123,47,190,0.08)", position: "relative" }}>
      <div
        style={{
          height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #7B2FBE, #C084FC)",
          transition: "width 0.55s cubic-bezier(0.4,0,0.2,1)",
          borderRadius: "0 2px 2px 0",
        }}
      />
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({ pct }: { pct: number }) {
  return (
    <div
      style={{
        flexShrink: 0,
        background: "rgba(255, 255, 255, 0.4)",
        borderBottom: "1.5px solid #2E1854",
        zIndex: 10,
      }}
    >
      {/* Top Window Bar (OS window style) */}
      <div
        style={{
          padding: "10px 20px 8px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)"
        }}
      >
        <WindowDots />
        <div style={{ flex: 1, textAlign: "center", fontSize: 11, fontWeight: 700, color: "#2E1854", letterSpacing: "0.5px", textTransform: "uppercase", marginRight: 36 }}>
          Booking Assistant 🧘
        </div>
      </div>

      <div
        style={{
          display: "flex", alignItems: "center",
          padding: "12px 20px", justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#7B2FBE", letterSpacing: "-0.3px", lineHeight: 1.2 }}>
            NavigateSkills Academy
          </div>
          <div style={{ fontSize: 10, color: "#6B7280", marginTop: 1, fontWeight: 500 }}>
            Online Yoga, Fitness &amp; Learning
          </div>
        </div>
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#16A34A", color: "#fff", fontWeight: 700, fontSize: 11,
            padding: "6px 14px", borderRadius: 9999, textDecoration: "none",
            boxShadow: "0 2px 8px rgba(22,163,74,0.2)", display: "inline-block",
            transition: "all 0.2s",
          }}
        >
          ₹20 Trial
        </a>
      </div>
      {pct > 0 && <ProgressBar pct={pct} />}
    </div>
  );
}

// ─── Inline Chat Options (appear inline in the chat scroll area) ────────────────

function InlineBatchOptions({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex", alignItems: "flex-start", gap: 8,
      }}
    >
      <div style={{ width: 36, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: 11, color: "#9CA3AF", fontWeight: 700, marginBottom: 8,
          textTransform: "uppercase", letterSpacing: "0.6px",
        }}>
          Tap to choose
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {BATCH_OPTIONS.map((b, idx) => (
            <motion.button
              key={b.id}
              id={`batch-${b.id}`}
              onClick={() => onSelect(b.id)}
              whileHover={{ scale: 1.06, y: -4, boxShadow: "0 10px 22px rgba(123,47,190,0.18)" }}
              whileTap={{ scale: 0.96 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 300, damping: 20 }}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 6, padding: "14px 18px", borderRadius: 14,
                border: "1px solid rgba(255, 255, 255, 0.6)", 
                background: "rgba(255, 255, 255, 0.7)",
                cursor: "pointer", minWidth: 105,
                boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                outline: "none",
                backdropFilter: "blur(8px)",
              }}
            >
              <span style={{ fontSize: 28 }}>{b.icon}</span>
              <span style={{ fontWeight: 700, fontSize: 13, color: "#1C1C1C" }}>{b.label}</span>
              <span style={{ fontSize: 10, color: "#6B7280", marginTop: 2, fontWeight: 500, textAlign: "center" }}>
                {b.slots.join(", ")}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function InlineSlotOptions({ batchId, onSelect, onBack }: { batchId: string; onSelect: (slot: string) => void; onBack: () => void }) {
  const batch = BATCH_OPTIONS.find(b => b.id === batchId);
  if (!batch) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex", alignItems: "flex-start", gap: 8,
      }}
    >
      <div style={{ width: 36, flexShrink: 0 }} />
      <div>
        <p style={{
          fontSize: 11, color: "#9CA3AF", fontWeight: 700, marginBottom: 8,
          textTransform: "uppercase", letterSpacing: "0.6px",
        }}>
          Choose a slot
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          {batch.slots.map((slot, idx) => (
            <motion.button
              key={slot}
              id={`slot-${slot.replace(/\s/g, "-")}`}
              onClick={() => onSelect(slot)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.08, type: "spring", stiffness: 300, damping: 20 }}
              style={{
                padding: "11px 24px", borderRadius: 9999,
                border: "1px solid rgba(255, 255, 255, 0.4)", 
                background: "rgba(243, 232, 255, 0.75)",
                color: "#7B2FBE", fontWeight: 700, fontSize: 14,
                cursor: "pointer", outline: "none",
                backdropFilter: "blur(8px)",
              }}
            >
              {slot}
            </motion.button>
          ))}
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: batch.slots.length * 0.08 }}
            style={{
              padding: "11px 24px", borderRadius: 9999,
              border: "1px solid rgba(255,255,255,0.4)", 
              background: "rgba(255,255,255,0.6)",
              color: "#6B7280", fontWeight: 700, fontSize: 14,
              cursor: "pointer", outline: "none",
              backdropFilter: "blur(8px)",
            }}
          >
            ← Back
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Bottom Input Panels ──────────────────────────────────────────────────────

function NamePanel({
  initialValue, onSubmit, error, clearError, onBack,
}: {
  initialValue: string; onSubmit: (val: string) => void; error: string | null; clearError: () => void; onBack: (val: string) => void;
}) {
  const [localValue, setLocalValue] = useState(initialValue);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <motion.button
          onClick={() => onBack(localValue)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: "rgba(243, 232, 255, 0.8)", color: "#7B2FBE", border: "1px solid rgba(123, 47, 190, 0.2)",
            borderRadius: 12, width: 50, height: 50, fontSize: 18, flexShrink: 0,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s", backdropFilter: "blur(8px)"
          }}
          title="Go Back"
        >
          ←
        </motion.button>
        <input
          ref={ref}
          id="input-name"
          type="text"
          value={localValue}
          onChange={e => {
            setLocalValue(e.target.value);
            if (error) clearError();
          }}
          onKeyDown={e => e.key === "Enter" && onSubmit(localValue)}
          placeholder="Type your full name…"
          maxLength={60}
          style={{
            flex: 1, padding: "13px 16px", borderRadius: 12,
            border: error ? "2px solid #DC2626" : "1px solid rgba(123, 47, 190, 0.2)",
            fontSize: 15, color: "#1C1C1C", outline: "none", 
            background: "rgba(255, 255, 255, 0.75)",
            transition: "border 0.2s",
            backdropFilter: "blur(8px)"
          }}
          onFocus={e => { if (!error) e.currentTarget.style.borderColor = "#7B2FBE"; }}
          onBlur={e => { if (!error) e.currentTarget.style.borderColor = "rgba(123, 47, 190, 0.2)"; }}
        />
        <SendBtn onClick={() => onSubmit(localValue)} />
      </div>
      {error && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 6 }}>{error}</p>}
    </motion.div>
  );
}

function PhonePanel({
  initialValue, onSubmit, error, clearError, onBack,
}: {
  initialValue: string; onSubmit: (val: string) => void; error: string | null; clearError: () => void; onBack: (val: string) => void;
}) {
  const [localValue, setLocalValue] = useState(initialValue);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <motion.button
          onClick={() => onBack(localValue)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: "rgba(243, 232, 255, 0.8)", color: "#7B2FBE", border: "1px solid rgba(123, 47, 190, 0.2)",
            borderRadius: 12, width: 50, height: 50, fontSize: 18, flexShrink: 0,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s", backdropFilter: "blur(8px)"
          }}
          title="Go Back"
        >
          ←
        </motion.button>
        <span
          style={{
            background: "rgba(243, 232, 255, 0.8)", color: "#7B2FBE", fontWeight: 700,
            fontSize: 15, padding: "13px 13px", borderRadius: 12,
            border: "1px solid rgba(123, 47, 190, 0.2)", whiteSpace: "nowrap", flexShrink: 0,
            backdropFilter: "blur(8px)"
          }}
        >
          +91
        </span>
        <input
          ref={ref}
          id="input-phone"
          type="tel"
          value={localValue}
          onChange={e => {
            const cleanVal = e.target.value.replace(/\D/g, "").slice(0, 10);
            setLocalValue(cleanVal);
            if (error) clearError();
          }}
          onKeyDown={e => e.key === "Enter" && onSubmit(localValue)}
          placeholder="10-digit number"
          maxLength={10}
          inputMode="numeric"
          style={{
            flex: 1, padding: "13px 16px", borderRadius: 12,
            border: error ? "2px solid #DC2626" : "1px solid rgba(123, 47, 190, 0.2)",
            fontSize: 15, color: "#1C1C1C", outline: "none", 
            background: "rgba(255, 255, 255, 0.75)",
            letterSpacing: "1.5px", transition: "border 0.2s",
            backdropFilter: "blur(8px)"
          }}
          onFocus={e => { if (!error) e.currentTarget.style.borderColor = "#7B2FBE"; }}
          onBlur={e => { if (!error) e.currentTarget.style.borderColor = "rgba(123, 47, 190, 0.2)"; }}
        />
        <SendBtn onClick={() => onSubmit(localValue)} />
      </div>
      {error && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 6 }}>{error}</p>}
    </motion.div>
  );
}

function RequirementPanel({
  initialValue, onSubmit, onBack,
}: {
  initialValue: string; onSubmit: (val: string, skip: boolean) => void; onBack: (val: string) => void;
}) {
  const [localValue, setLocalValue] = useState(initialValue);
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ position: "relative", marginBottom: 10 }}>
        <textarea
          id="textarea-requirement"
          value={localValue}
          onChange={e => setLocalValue(e.target.value)}
          rows={3}
          maxLength={300}
          placeholder="E.g. knee problem, back pain, complete beginner… (optional)"
          style={{
            width: "100%", padding: "12px 16px 28px", borderRadius: 12,
            border: "1px solid rgba(123, 47, 190, 0.2)", fontSize: 14, color: "#1C1C1C",
            outline: "none", background: "rgba(255, 255, 255, 0.75)", resize: "none",
            fontFamily: "inherit", lineHeight: 1.55, boxSizing: "border-box",
            transition: "border 0.2s",
            backdropFilter: "blur(8px)"
          }}
          onFocus={e => (e.currentTarget.style.borderColor = "#7B2FBE")}
          onBlur={e => (e.currentTarget.style.borderColor = "rgba(123, 47, 190, 0.2)")}
        />
        <span
          style={{
            position: "absolute", bottom: 9, right: 13,
            fontSize: 11, fontWeight: 500, pointerEvents: "none",
            color: localValue.length >= 270 ? "#DC2626" : "#9CA3AF",
          }}
        >
          {localValue.length}/300
        </span>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <motion.button
          id="btn-back"
          onClick={() => onBack(localValue)}
          whileHover={{ scale: 1.03, background: "rgba(243, 232, 255, 0.8)" }}
          whileTap={{ scale: 0.97 }}
          style={{
            marginRight: "auto",
            padding: "11px 22px", borderRadius: 10,
            border: "1px solid rgba(123, 47, 190, 0.25)", background: "transparent",
            color: "#7B2FBE", fontWeight: 700, fontSize: 14, cursor: "pointer",
            transition: "all 0.2s", backdropFilter: "blur(8px)"
          }}
        >
          ← Back
        </motion.button>
        <motion.button
          id="btn-skip"
          onClick={() => onSubmit(localValue, true)}
          whileHover={{ scale: 1.03, background: "rgba(243, 232, 255, 0.8)" }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: "11px 22px", borderRadius: 10,
            border: "1px solid rgba(123, 47, 190, 0.25)", background: "transparent",
            color: "#7B2FBE", fontWeight: 700, fontSize: 14, cursor: "pointer",
            transition: "all 0.2s", backdropFilter: "blur(8px)"
          }}
        >
          Skip
        </motion.button>
        <motion.button
          id="btn-submit"
          onClick={() => onSubmit(localValue, false)}
          whileHover={{ scale: 1.03, background: "#6A1FA8" }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: "11px 24px", borderRadius: 10,
            background: "#7B2FBE", color: "#fff",
            border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer",
            boxShadow: "0 4px 14px rgba(123,47,190,0.3)", transition: "background 0.2s",
          }}
        >
          Submit →
        </motion.button>
      </div>
    </motion.div>
  );
}

function CompletedPanel({
  onRestart, waUrl
}: {
  onRestart: () => void; waUrl: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      style={{ textAlign: "center", padding: "15px 0" }}
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        style={{ fontSize: 52, marginBottom: 12 }}
      >
        🎉
      </motion.div>
      <h3 style={{ fontSize: 19, fontWeight: 800, color: "#7B2FBE", marginBottom: 6 }}>
        Trial Booked Successfully!
      </h3>
      <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 16, maxWidth: 450, margin: "0 auto 16px" }}>
        We are redirecting you to WhatsApp with your prefilled details. If the chat window did not open, please click below:
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <motion.a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05, boxShadow: "0 6px 20px rgba(22,163,74,0.35)" }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: "12px 24px", borderRadius: 10,
            background: "#16A34A", color: "#fff",
            fontWeight: 700, fontSize: 14, textDecoration: "none",
            boxShadow: "0 4px 14px rgba(22,163,74,0.25)",
            display: "inline-block", transition: "all 0.2s"
          }}
        >
          Open WhatsApp Chat
        </motion.a>
        <motion.button
          onClick={onRestart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: "12px 20px", borderRadius: 10,
            border: "1px solid #7B2FBE", background: "transparent",
            color: "#7B2FBE", fontWeight: 700, fontSize: 14, cursor: "pointer",
            transition: "all 0.2s",
            outline: "none"
          }}
        >
          Book Another Class
        </motion.button>
      </div>
    </motion.div>
  );
}

function SendBtn({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08, background: "#6A1FA8" }}
      whileTap={{ scale: 0.94 }}
      style={{
        background: "#7B2FBE", color: "#fff", border: "none", borderRadius: 12,
        width: 50, height: 50, fontSize: 18, flexShrink: 0,
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 12px rgba(123,47,190,0.3)", transition: "all 0.2s",
        outline: "none"
      }}
    >
      ➤
    </motion.button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function WindowDots() {
  return (
    <div style={{ display: "flex", gap: 5 }}>
      <span className="dot-control dot-red" />
      <span className="dot-control dot-yellow" />
      <span className="dot-control dot-green" />
    </div>
  );
}

function BackgroundDecorations() {
  return (
    <svg
      className="desktop-svg-decorations"
      viewBox="0 0 1000 800"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1
      }}
    >
      {/* Green circuit 1 (top-left to middle-left) */}
      <path
        d="M 20,220 H 130 V 380 H 160"
        fill="none"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="20" cy="220" r="5" fill="#10B981" />
      <circle cx="160" cy="380" r="5" fill="none" stroke="#10B981" strokeWidth="2" />

      {/* Green circuit 2 (middle-right to bottom-right) */}
      <path
        d="M 860,380 H 800 V 580 H 880"
        fill="none"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="880" cy="580" r="5" fill="#10B981" />
      <circle cx="860" cy="380" r="5" fill="none" stroke="#10B981" strokeWidth="2" />

      {/* Purple dashed linkage lines */}
      <line x1="160" y1="360" x2="210" y2="360" stroke="#7B2FBE" strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="720" y1="460" x2="770" y2="460" stroke="#7B2FBE" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Floating vector shapes */}
      {/* Yellow Triangle (top-left) */}
      <polygon
        points="190,140 210,170 170,170"
        fill="#FBBF24"
        stroke="#2E1854"
        strokeWidth="2"
        transform="rotate(15, 190, 155)"
      />
      {/* Green Triangle (top-right) */}
      <polygon
        points="830,210 850,240 810,240"
        fill="#34D399"
        stroke="#2E1854"
        strokeWidth="2"
        transform="rotate(-25, 830, 225)"
      />
      {/* Circle (bottom-left) */}
      <circle cx="170" cy="670" r="12" fill="none" stroke="#34D399" strokeWidth="3" />
      
      {/* Outline Black/Navy Circle */}
      <circle cx="820" cy="650" r="10" fill="none" stroke="#2E1854" strokeWidth="3" />
      
      {/* Small dots */}
      <circle cx="130" cy="270" r="4" fill="#7B2FBE" />
      <circle cx="800" cy="520" r="4" fill="#C084FC" />
    </svg>
  );
}

export default function YogaConversationPage() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState<Step>("init");
  const [batchId, setBatchId] = useState("");
  const [batchLabel, setBatchLabel] = useState("");   // e.g. 'Morning'
  const [savedSlot, setSavedSlot] = useState("");      // e.g. '6–7 AM'
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [reqInput, setReqInput] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [savedName, setSavedName] = useState("");
  const [savedPhone, setSavedPhone] = useState("");    // needed for DB insert
  const [waUrl, setWaUrl] = useState("");
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on every message / typing / step change
  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // Accompany with a short delayed scroll to ensure keyboard layout shifts / custom option heights are finalized
    const t = setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 70);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const cleanup = scrollToBottom();
    return cleanup;
  }, [messages, isTyping, step, scrollToBottom]);

  // Add a bot message with a realistic typing delay
  const botSay = useCallback((text: string, ms = 900): Promise<void> =>
    new Promise(resolve => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { id: uid(), from: "bot", text }]);
        setTimeout(resolve, 120);
      }, ms);
    }),
  []);

  function userSay(text: string) {
    setMessages(prev => [...prev, { id: uid(), from: "user", text }]);
  }

  // Confetti Particle Engine trigger
  const triggerConfetti = () => {
    setConfettiTrigger(prev => prev + 1);
  };

  // Opening sequence — runs once on mount
  const openingDone = useRef(false);
  useEffect(() => {
    if (openingDone.current) return;
    openingDone.current = true;
    (async () => {
      await botSay("Hi there!! 😊 You’re with **Top rated #1 Yoga classes**", 650);
      await botSay("I'll help you book your **Online Yoga Class** 🧘 — just 4 quick questions!", 1100);
      await botSay("Let's start — **which batch timing suits you?**", 800);
      setStep("batch");
    })();
  }, [botSay]);

  // Progress percentage
  const progress =
    step === "init"        ? 0  :
    step === "batch"       ? 15 :
    step === "slot"        ? 25 :
    step === "name"        ? 50 :
    step === "phone"       ? 75 : 100;

  const goBack = useCallback((currentInputValue?: string) => {
    if (step === "slot") {
      setBatchId("");
      setBatchLabel("");
      setMessages(prev => {
        const idx = prev.findLastIndex(m => m.from === "user");
        if (idx !== -1) return prev.slice(0, idx);
        return prev;
      });
      setStep("batch");
    } else if (step === "name") {
      if (currentInputValue !== undefined) setNameInput(currentInputValue);
      setSavedSlot("");
      setMessages(prev => {
        const idx = prev.findLastIndex(m => m.from === "user");
        if (idx !== -1) return prev.slice(0, idx);
        return prev;
      });
      setStep("slot");
    } else if (step === "phone") {
      if (currentInputValue !== undefined) setPhoneInput(currentInputValue);
      setSavedName("");
      setMessages(prev => {
        const idx = prev.findLastIndex(m => m.from === "user");
        if (idx !== -1) return prev.slice(0, idx);
        return prev;
      });
      setStep("name");
    } else if (step === "requirement") {
      if (currentInputValue !== undefined) setReqInput(currentInputValue);
      setSavedPhone("");
      setMessages(prev => {
        const idx = prev.findLastIndex(m => m.from === "user");
        if (idx !== -1) return prev.slice(0, idx);
        return prev;
      });
      setStep("phone");
    }
  }, [step]);

  // ─── Step handlers ───────────────────────────────────────────────────────────

  async function handleBatchSelect(id: string) {
    const b = BATCH_OPTIONS.find(x => x.id === id)!;
    setBatchId(id);
    setBatchLabel(b.label);       // save for DB
    userSay(`${b.icon} ${b.label}`);
    setStep("init");
    await botSay(`Great choice! 🌟 Which **time slot** works best for you?`, 700);
    setStep("slot");
  }

  async function handleSlotSelect(slot: string) {
    setSavedSlot(slot);           // save for DB
    userSay(slot);
    setStep("init");
    await botSay("Perfect! 😊 Now, **what's your name?**", 750);
    setStep("name");
  }

  async function handleNameSubmit(nameInputVal: string) {
    const err = validateName(nameInputVal);
    setNameError(err);
    if (err) return;
    const name = nameInputVal.trim();
    setSavedName(name);
    userSay(name);
    setNameInput("");
    setStep("init");
    await botSay(`Nice to meet you, **${name}**! 🙏`, 700);
    await botSay("What's your **WhatsApp number?** I'll send the class details there.", 900);
    setStep("phone");
  }

  async function handlePhoneSubmit(phoneInputVal: string) {
    const err = validatePhone(phoneInputVal);
    setPhoneError(err);
    if (err) return;
    setSavedPhone(phoneInputVal);    // save for DB
    userSay(`+91 ${phoneInputVal}`);
    setPhoneInput("");
    setStep("init");
    await botSay("Almost done! 🎉 Do you have any **special requirements or modifications?**", 950);
    await botSay("*(E.g. knee issue, back pain, complete beginner…)*\nFeel free to **skip** if none!", 700);
    setStep("requirement");
  }

  function handleRequirementSubmit(reqInputVal: string, skip: boolean) {
    const req = (!skip && reqInputVal.trim()) ? reqInputVal.trim() : null;
    if (req) {
      userSay(req);
    } else {
      userSay("No special requirements 👍");
    }

    // ── Fire-and-forget DB save ──────────────────────────────────────────────
    fetch("/api/yoga-leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name:        savedName,
        phone:       savedPhone,
        batch:       batchLabel,
        slot:        savedSlot,
        requirement: req,
      }),
    }).catch(err => console.error("[yoga-leads] save failed:", err));
    // ────────────────────────────────────────────────────────────────────────

    let waText = `hey i just filled up your form for online yoga classes\n\n`;
    waText += `here are my details:\n`;
    waText += `• Name: ${savedName}\n`;
    waText += `• Phone: ${savedPhone}\n`;
    waText += `• Batch: ${batchLabel}\n`;
    waText += `• Time Slot: ${savedSlot}\n`;
    if (req) {
      waText += `• Requirements: ${req}\n`;
    }
    waText += `\nand please call me on this no: ${savedPhone}`;

    const dynamicWaUrl = `https://wa.me/919218187041?text=${encodeURIComponent(waText)}`;
    setWaUrl(dynamicWaUrl);
    window.open(dynamicWaUrl, "_blank");

    // Confetti!
    triggerConfetti();

    setStep("completed");
  }

  function handleRestart() {
    setMessages([]);
    setBatchId("");
    setBatchLabel("");
    setSavedSlot("");
    setSavedName("");
    setSavedPhone("");
    setNameInput("");
    setPhoneInput("");
    setReqInput("");
    setNameError(null);
    setPhoneError(null);
    setWaUrl("");
    setConfettiTrigger(0);
    setStep("init");
    openingDone.current = false;
    (async () => {
      openingDone.current = true;
      await botSay("Hi there!! 😊 You’re with **Top rated #1 Yoga classes**", 650);
      await botSay("I'll help you book your **Online Yoga Class** 🧘 — just 4 quick questions!", 1100);
      await botSay("Let's start — **which batch timing suits you?**", 800);
      setStep("batch");
    })();
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  const showInput = !isTyping && (step === "name" || step === "phone" || step === "requirement" || step === "completed");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PAGE_STYLES }} />

      <div
        style={{
          display: "flex", flexDirection: "column",
          height: "100svh", overflow: "hidden",
          background: "linear-gradient(135deg, #EEF2FF 0%, #FAF5FF 50%, #FDF4FF 100%)",
          position: "relative",
        }}
      >
        {/* Floating Backdrop Blobs (Glassmorphism highlight) */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
          <div className="blob1" />
          <div className="blob2" />
        </div>

        {/* Live Confetti Canvas */}
        <ConfettiCanvas trigger={confettiTrigger} />

        <div className="window-outline-wrap">
          {/* Main Chat Assistant Window */}
          <div
            className="glass-window-frame main-window-container"
            style={{
              zIndex: 10,
            }}
          >
            <div className="glass-window-inner">
                
                {/* ── Header ── */}
                <Header pct={progress} />

                {/* ── Chat scroll area ── */}
                <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 10px", position: "relative", zIndex: 5 }}>
                  <div
                    style={{
                      maxWidth: 600, margin: "0 auto",
                      display: "flex", flexDirection: "column", gap: 14,
                    }}
                  >
                    <AnimatePresence>
                      {messages.map(m =>
                        m.from === "bot"
                          ? <BotBubble key={m.id} text={m.text} />
                          : <UserBubble key={m.id} text={m.text} />
                      )}
                    </AnimatePresence>
                    
                    {isTyping && <TypingIndicator />}

                    {/* Batch & slot options appear inline in the chat, beside bot messages */}
                    {!isTyping && step === "batch" && (
                      <InlineBatchOptions onSelect={handleBatchSelect} />
                    )}
                    {!isTyping && step === "slot" && (
                      <InlineSlotOptions batchId={batchId} onSelect={handleSlotSelect} onBack={goBack} />
                    )}

                    <div ref={chatEndRef} style={{ height: 6 }} />
                  </div>
                </div>

                {/* ── Input panel (slides in when bot finishes typing) ── */}
                {showInput && (
                  <div
                    style={{
                      flexShrink: 0,
                      background: "rgba(255, 255, 255, 0.22)",
                      backdropFilter: "blur(20px)",
                      borderTop: "1.5px solid #2E1854",
                      boxShadow: "0 -4px 24px rgba(0,0,0,0.01)",
                      padding: "16px 16px 20px",
                      zIndex: 10,
                    }}
                  >
                    <div style={{ maxWidth: 600, margin: "0 auto" }}>
                      <AnimatePresence mode="wait">
                        {step === "name" && (
                          <NamePanel
                            key="name"
                            initialValue={nameInput}
                            onSubmit={handleNameSubmit}
                            error={nameError}
                            clearError={() => setNameError(null)}
                            onBack={goBack}
                          />
                        )}
                        {step === "phone" && (
                          <PhonePanel
                            key="phone"
                            initialValue={phoneInput}
                            onSubmit={handlePhoneSubmit}
                            error={phoneError}
                            clearError={() => setPhoneError(null)}
                            onBack={goBack}
                          />
                        )}
                        {step === "requirement" && (
                          <RequirementPanel
                            key="req"
                            initialValue={reqInput}
                            onSubmit={handleRequirementSubmit}
                            onBack={goBack}
                          />
                        )}
                        {step === "completed" && (
                          <CompletedPanel
                            key="completed"
                            waUrl={waUrl}
                            onRestart={handleRestart}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
