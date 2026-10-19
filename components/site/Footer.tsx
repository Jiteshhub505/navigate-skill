"use client";
import { Sparkles, Instagram, Twitter, Youtube, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="relative mt-20 border-t border-primary/20">
      {/* top glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[60%] h-24 blur-3xl opacity-50"
           style={{ background: "var(--gradient-primary)" }} />

      <div className="relative glass-strong">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <a href="#home" className="flex items-center gap-2">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-primary glow-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </span>
              <span className="font-display font-bold text-lg">
                <span className="text-white">Navigate</span>
                <span className="text-gradient"> Skill</span>
              </span>
            </a>
            <p className="mt-5 text-sm text-muted-foreground max-w-sm">
              Premium online programs in yoga, fitness, finance and personal
              growth — designed to transform the way you live.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Twitter, Youtube, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid place-items-center w-10 h-10 rounded-xl glass hover:bg-gradient-primary hover:glow-sm transition-all"
                  aria-label="social"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {["Home", "About", "Courses", "Mentors", "Pricing"].map((l) => (
                <li key={l}><a href="#" className="hover:text-primary-glow transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Courses</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {["Yoga", "Fitness", "Finance", "Dance", "Personal Growth"].map((l) => (
                <li key={l}><a href="#" className="hover:text-primary-glow transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-primary-glow" /> hello@navigateskill.com</li>
              <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-primary-glow" /> +91 92181 87041</li>
              <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-primary-glow" /> C-9/15, Sector 7, Rohini, Delhi - 110085</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/15">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Navigate Skill Academy. All rights reserved.</p>
            <div className="flex gap-5">
              <a href="/privacy-policy" className="hover:text-primary-glow">Privacy</a>
              <a href="/refund-policy" className="hover:text-primary-glow">Refund Policy</a>
              <a href="/health-safety-waiver" className="hover:text-primary-glow">Waiver</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
