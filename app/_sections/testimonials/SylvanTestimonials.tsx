'use client';

import React, { useState } from 'react';
import { Badge } from '@/app/_components/ui/Badge';

export const SylvanTestimonials: React.FC = () => {
  const [theme, setTheme] = useState<'travel' | 'admin'>('travel');

  const testimonials = [
    {
      author: 'Elara Vance',
      role: 'Expedition Lead @ FieldOps',
      handle: '@elara_v',
      quote: 'Sylvan completely revolutionized our trekking coordination in deep Mount Rinjani sectors. Flawless offline maps and reliable porters.',
      tag: 'Field Milestone',
    },
    {
      author: 'Dr. Aris Thorne',
      role: 'Marine Biologist & Conservationist',
      handle: '@dr_aris',
      quote: 'Integrating their private charter boats into our secret Gili coral monitoring was entirely seamless. Unmatched local navigation skills.',
      tag: 'Verified Partner',
    },
    {
      author: 'Jonah R. Fielding',
      role: 'Villa Portfolio Investor',
      handle: '@fielding_re',
      quote: 'The legal diligence dossier on our Kuta Mandalika land purchase saved us months of notary backlog. True PT PMA specialists.',
      tag: 'Real Estate ROI',
    },
    {
      author: 'Team Alpha',
      role: 'Surf & Adventure Crew',
      handle: '@team_alpha',
      quote: 'Instant airport pick-ups right on time with surf racks ready on the HiAce. The smoothest logistics in South Lombok.',
      tag: 'Transport 24/7',
    },
    {
      author: 'M. Chen',
      role: 'Luxury Travel Curator',
      handle: '@mchen_travel',
      quote: 'High-touch personalized itineraries with bespoke catering on private islands. Our VIP honeymooners were blown away.',
      tag: 'VIP Experience',
    },
  ];

  return (
    <section
      data-theme={theme}
      className={`py-20 lg:py-28 transition-colors duration-500 ${
        theme === 'travel'
          ? 'bg-[#1B2B22] text-[#F3F6F1]'
          : 'bg-[#0A0E17] text-[#F1F5FB]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Theme Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#34D399]">
                // Sylvan Showcase UI
              </span>
              <Badge variant={theme === 'travel' ? 'emerald' : 'blue'}>
                {theme.toUpperCase()} PALETTE
              </Badge>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-none">
              A place to display your field milestones.
            </h2>
            <p
              className={`text-sm sm:text-base ${
                theme === 'travel' ? 'text-[#9CB0A3]' : 'text-[#7C8AA3]'
              }`}
            >
              Dual-theme interface-first bento architecture designed for transparent field proof and client milestones.
            </p>
          </div>

          {/* Theme Switcher Controls */}
          <div
            className={`flex p-1.5 rounded-[23px] border ${
              theme === 'travel'
                ? 'bg-[#22352A] border-[#2C4235]'
                : 'bg-[#0F1522] border-[#1C2436]'
            }`}
          >
            <button
              type="button"
              onClick={() => setTheme('travel')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                theme === 'travel'
                  ? 'bg-[#10B981] text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🌴 Travel Theme
            </button>
            <button
              type="button"
              onClick={() => setTheme('admin')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                theme === 'admin'
                  ? 'bg-[#2563EB] text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ Admin Theme
            </button>
          </div>
        </div>

        {/* Bento Array Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Main Hero Card (2 cols) */}
          <div
            className={`md:col-span-2 p-8 rounded-[23px] border transition-all duration-300 flex flex-col justify-between ${
              theme === 'travel'
                ? 'bg-[#22352A] border-[#2C4235]'
                : 'bg-[#0F1522] border-[#1C2436]'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400">
                  {testimonials[0].tag}
                </span>
                <span className="text-xs text-slate-400">@field_ops</span>
              </div>
              <p className="text-xl sm:text-2xl font-medium leading-snug">
                &ldquo;{testimonials[0].quote}&rdquo;
              </p>
            </div>

            <div className="pt-8 flex items-center justify-between border-t border-white/5">
              <div>
                <h4 className="font-bold text-base">{testimonials[0].author}</h4>
                <p className="text-xs text-slate-400">{testimonials[0].role}</p>
              </div>
              <span className="font-mono text-xs text-emerald-400 font-bold">
                {testimonials[0].handle}
              </span>
            </div>
          </div>

          {/* Secondary Cards */}
          {testimonials.slice(1).map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-[23px] border transition-all duration-300 flex flex-col justify-between ${
                theme === 'travel'
                  ? 'bg-[#22352A] border-[#2C4235] hover:border-emerald-500/50'
                  : 'bg-[#0F1522] border-[#1C2436] hover:border-blue-500/50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-emerald-400">
                    {item.tag}
                  </span>
                </div>
                <p className="text-sm font-normal leading-relaxed opacity-90">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-white/5">
                <h4 className="font-bold text-sm">{item.author}</h4>
                <p className="text-[11px] text-slate-400">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
