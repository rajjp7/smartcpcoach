import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { ArrowRight, BarChart, CheckCircle, Zap, Menu, X } from 'lucide-react';

export default function App() {
  return <LandingPage />;
}

// Reusable AnimatedSection (scroll-triggered)
const AnimatedSection = ({ children, className = '', id }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) mainControls.start('visible');
  }, [isInView, mainControls]);

  return (
    <motion.section
      id={id}
      ref={ref}
      className={className}
      variants={{ hidden: { opacity: 0, y: 60, filter: 'blur(6px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)' } }}
      initial="hidden"
      animate={mainControls}
      transition={{ duration: 0.7 }}
    >
      {children}
    </motion.section>
  );
};

function LandingPage() {
  // Navbar shrink on scroll
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile menu
  const [open, setOpen] = useState(false);

  // Hero animations
  const heroContentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  };
  const heroItem = { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.6 } } };

  // Feature card animation variants
  const featureCard = { hidden: { y: 40, opacity: 0, scale: 0.98 }, visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.5 } } };

  // small utilities for accessible focus ring when using keyboard
  useEffect(() => {
    const handleFirstTab = (e) => {
      if (e.key === 'Tab') document.documentElement.classList.add('user-is-tabbing');
    };
    window.addEventListener('keydown', handleFirstTab);
    return () => window.removeEventListener('keydown', handleFirstTab);
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden">
      {/* --- Global styles and fonts (Tailwind is expected) --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Poppins:wght@600;700&display=swap');
        .font-heading{ font-family: 'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto; }
        .font-body{ font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto; }

        /* animated gradient + subtle noise overlay */
        .animated-gradient-bg{ background: linear-gradient(120deg,#041223 0%, #07222e 45%, #031024 100%); background-size: 200% 200%; animation: g 16s ease infinite; }
        @keyframes g{ 0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%} }

        .noise::after{ content: ''; position: absolute; inset:0; z-index:0; pointer-events:none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Cfilter id='f'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)' opacity='0.03'/%3E%3C/svg%3E");
        }

        /* Floating soft blobs used for depth */
        .blob{ position:absolute; filter: blur(40px); opacity:0.25; transform: translateZ(0); }

        /* small accessible focus style */
        .user-is-tabbing :focus{ outline: 3px solid rgba(34,211,238,0.16); outline-offset: 3px; }

        /* liquid underline */
        .liquid-underline::after{ content:''; position:absolute; left:0; bottom:-6px; height:3px; width:0; border-radius:999px; background: linear-gradient(90deg,#67e8f9,#06b6d4); transition: width .35s cubic-bezier(.2,.8,.2,1); }
        .liquid-underline:hover::after{ width:100%; }

        /* card gradient border */
        .card-border{ background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02)); border-radius: 18px; }
        .card-border::before{ content:''; position:absolute; inset:-1px; border-radius:20px; background: linear-gradient(90deg, rgba(34,211,238,0.08), rgba(99,102,241,0.06)); z-index:-1; }

        /* tilt hover transform fallback for small devices */
        @media (prefers-reduced-motion: reduce){ *{ animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; } }
      `}</style>

      {/* Background blobs + subtle particles - purely decorative */}
      <div className="absolute inset-0 pointer-events-none z-0 animated-gradient-bg noise">
        <svg width="0" height="0" className="hidden" />
        <div className="blob left-[-12%] top-10 w-[48rem] h-[48rem] rounded-full bg-gradient-to-tr from-cyan-500 to-violet-600 opacity-40 mix-blend-screen" />
        <div className="blob right-[-10%] bottom-10 w-[36rem] h-[36rem] rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 opacity-30 mix-blend-screen" />

        {/* subtle floating dots */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="g1"><stop offset="0%" stopColor="#67e8f9" stopOpacity="0.12"/><stop offset="100%" stopColor="#67e8f9" stopOpacity="0"/></radialGradient>
          </defs>
          <circle cx="6%" cy="20%" r="6" fill="url(#g1)" />
          <circle cx="85%" cy="70%" r="10" fill="url(#g1)" />
        </svg>
      </div>

      {/* NAVBAR */}
      <header className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[92%] max-w-6xl transition-all ${scrolled ? 'backdrop-blur-md bg-slate-900/60 border border-slate-800/60 py-2 rounded-2xl shadow-lg' : 'bg-transparent py-4'} `}>
        <nav className="flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-400/80 flex items-center justify-center shadow-md">
              <span className="font-heading text-slate-950 font-bold">CP</span>
            </div>
            <div>
              <a href="#" className="inline-flex items-baseline gap-2">
                <h1 className="text-lg md:text-xl font-heading font-bold tracking-tight">Smart <span className="text-cyan-300">CP</span> Coach</h1>
                <span className="text-xs text-slate-400 ml-2">beta</span>
              </a>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <a href="#about" className="relative liquid-underline">About</a>
            <a href="#features" className="relative liquid-underline">How it Works</a>
            <a href="#pricing" className="relative liquid-underline">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            <a href="/login" className="hidden sm:inline-flex px-3 py-2 rounded-md text-cyan-200 hover:text-white">Login</a>
            <a href="/register" className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-900 font-semibold shadow-md hover:scale-[1.02] transform transition">Get Started</a>

            {/* mobile menu button */}
            <button onClick={() => setOpen(o => !o)} aria-expanded={open} aria-label="Toggle menu" className="md:hidden p-2 rounded-md bg-white/3">
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu panel */}
        <motion.div initial={{ height: 0 }} animate={{ height: open ? 'auto' : 0 }} transition={{ duration: 0.28 }} className="md:hidden overflow-hidden mt-3">
          <div className="bg-slate-900/70 rounded-xl p-4 flex flex-col gap-3">
            <a href="#about" className="py-2 px-3 rounded-md">About</a>
            <a href="#features" className="py-2 px-3 rounded-md">How it Works</a>
            <a href="#pricing" className="py-2 px-3 rounded-md">Pricing</a>
            <div className="flex gap-2 mt-2">
              <a href="/login" className="flex-1 text-center py-2 rounded-md">Login</a>
              <a href="/register" className="flex-1 text-center py-2 rounded-md bg-cyan-500 text-slate-900 font-semibold">Register</a>
            </div>
          </div>
        </motion.div>
      </header>

      {/* HERO */}
      <main className="relative z-10">
        <section className="min-h-[92vh] flex items-center justify-center text-center px-6 py-24">
          <motion.div className="max-w-5xl w-full relative z-20" variants={heroContentVariants} initial="hidden" animate="visible">
            <motion.h2 className="font-heading text-5xl md:text-7xl lg:text-8xl leading-tight tracking-tight mb-6 drop-shadow-2xl" variants={heroItem}>
              <span className="block">Turn Failed</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-emerald-300">Submissions</span>
              <span className="block">into Your Strength.</span>
            </motion.h2>

            <motion.p className="text-slate-300 max-w-3xl mx-auto mb-8 font-body text-lg md:text-xl" variants={heroItem}>
              Smart CP Coach analyzes your failed submissions and gives you a tailored practice pathway — curated problems, focused tags and progress tracking so every fail teaches you something.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4" variants={heroItem}>
              <a href="/register" className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-900 font-semibold shadow-2xl transform transition hover:scale-105">
                Start Practicing <ArrowRight size={18} />
              </a>

              <a href="#features" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-800 text-slate-200 hover:bg-slate-900/40">
                Learn how it works
              </a>
            </motion.div>

            {/* subtle CTA stats */}
            <motion.div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-slate-300" variants={heroItem}>
              <div className="border border-slate-800/40 rounded-xl py-3 px-4">
                <div className="text-2xl font-bold">7</div>
                <div className="text-xs">Problems per fail</div>
              </div>
              <div className="border border-slate-800/40 rounded-xl py-3 px-4">
                <div className="text-2xl font-bold">Realtime</div>
                <div className="text-xs">Submission analysis</div>
              </div>
              <div className="border border-slate-800/40 rounded-xl py-3 px-4">
                <div className="text-2xl font-bold">Tags</div>
                <div className="text-xs">Tag-focused practice</div>
              </div>
              <div className="border border-slate-800/40 rounded-xl py-3 px-4">
                <div className="text-2xl font-bold">Tracker</div>
                <div className="text-xs">Progress dashboard</div>
              </div>
            </motion.div>

          </motion.div>
        </section>

        {/* ABOUT */}
        <AnimatedSection id="about" className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-heading font-bold mb-6">About Smart CP Coach</h3>
            <p className="text-slate-300 leading-relaxed text-lg md:text-xl">
              Built for competitive programmers who want focused improvement. Whenever you get a failed verdict, Smart CP Coach analyzes the error, the tags and your history — then recommends a short practice pathway (7 problems) to fix the exact concepts you struggled with.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/30" variants={featureCard} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Zap size={28} className="mb-3 text-cyan-300" />
                <h4 className="font-semibold mb-2">Submission Analysis</h4>
                <p className="text-slate-300 text-sm">Detects verdicts and isolates the precise failing concept — timeouts, WA patterns and runtime edge cases.</p>
              </motion.div>

              <motion.div className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/30" variants={featureCard} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <CheckCircle size={28} className="mb-3 text-cyan-300" />
                <h4 className="font-semibold mb-2">7 Problem Pathway</h4>
                <p className="text-slate-300 text-sm">A compact, focused practice set of 7 hand-picked problems to shore up the failing idea.</p>
              </motion.div>

              <motion.div className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/30" variants={featureCard} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <BarChart size={28} className="mb-3 text-cyan-300" />
                <h4 className="font-semibold mb-2">Progress Tracking</h4>
                <p className="text-slate-300 text-sm">Track tags you've mastered, problems solved and time spent improving through a clear dashboard.</p>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>

        {/* FEATURES - larger visual grid */}
        <AnimatedSection id="features" className="py-20 px-6 bg-slate-900/20">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center">How it Works — A quick walkthrough</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[{
                title: 'Analyze', desc: 'Parse verdicts & test-cases to find the failing concept and the edge-case patterns.'
              },{
                title: 'Recommend', desc: 'Curate 7 problems targeting the exact tags and sub-skills you need to practice.'
              },{
                title: 'Track', desc: 'Monitor improvement, mastered tags and suggestions based on your trajectory.'
              }].map((f, i) => (
                <motion.div key={i} whileHover={{ y: -8 }} className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-900/40 border border-slate-800/25 shadow-lg overflow-hidden">
                  <div className="absolute inset-0 opacity-6 mix-blend-screen" />
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-white/3">
                      <span className="text-2xl font-semibold text-cyan-300">{i+1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{f.title}</h4>
                      <p className="text-slate-300 text-sm">{f.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Callout / Pricing placeholder */}
        <AnimatedSection id="pricing" className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-900/40 border border-slate-800/30 shadow-lg">
              <h4 className="text-xl font-semibold mb-2">Start improving today</h4>
              <p className="text-slate-300 mb-6">Free tier available — upgrade for private analytics and longer history.</p>
              <div className="flex justify-center gap-4">
                <a href="/register" className="px-6 py-2 rounded-full bg-cyan-400 text-slate-900 font-semibold">Create account</a>
                <a href="#" className="px-6 py-2 rounded-full border border-slate-700">Contact Sales</a>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Footer */}
        <footer className="mt-12 border-t border-slate-800/30 py-8">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400">
            <div>© {new Date().getFullYear()} Smart CP Coach — Built with care.</div>
            <div className="flex gap-4 items-center">
              <a href="#" className="text-sm hover:underline">Privacy</a>
              <a href="#" className="text-sm hover:underline">Terms</a>
            </div>
          </div>
        </footer>

      </main>

    </div>
  );
}
