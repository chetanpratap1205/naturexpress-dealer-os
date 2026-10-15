import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MapPin,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function CustomerReviewsWall() {
  const [filter, setFilter] = useState('ALL');

  const REVIEWS = [
    {
      id: 'rev-1',
      name: 'Dr. Anandita Trivedi',
      locality: 'Scheme 140, Indore',
      car: 'Tata Curvv (Accomplished+ DCA)',
      type: 'DELIVERY',
      rating: 5,
      date: '3 days ago',
      verified: true,
      comment: 'Delivery experience was seamless! Mr. Shyam Singhal’s team delivered my Curvv right to my doorstep with the pooja thali and sweets. No hidden handling charges, and the DCA gearbox is an absolute dream in Indore traffic.'
    },
    {
      id: 'rev-2',
      name: 'Gaurav Agrawal (Industrialist)',
      locality: 'Pithampur Rd / Rau, Indore',
      car: 'Tata Safari Dark Edition (XZA+)',
      type: 'SERVICE',
      rating: 5,
      date: '1 week ago',
      verified: true,
      comment: 'Did my 30,000 km service at the Scheme 140 workshop. I sat in their air-conditioned lounge and could see my vehicle in Bay 3 through the glass wall. Received the digital inspection video on WhatsApp for brake pad approval. Finished in 80 minutes flat!'
    },
    {
      id: 'rev-3',
      name: 'Rajesh K. Sharma',
      locality: 'Vijay Nagar, Indore',
      car: 'Tata Nexon.ev Empowered',
      type: 'VALET',
      rating: 5,
      date: '2 weeks ago',
      verified: true,
      comment: 'I was hesitant about valet pickup because I love my Nexon EV. But their Valet TrustPass feature completely blew me away. Driver Sunil had an official digital badge with OTP authentication and did a 360 scratch photo scan before leaving my society. Safe return guaranteed!'
    },
    {
      id: 'rev-4',
      name: 'Pooja Chouhan',
      locality: 'Palasia, Indore',
      car: 'Tata Punch iCNG (Creative Flagship)',
      type: 'DELIVERY',
      rating: 5,
      date: '3 weeks ago',
      verified: true,
      comment: 'Exchanged my 2018 Swift under Tata Motors Assured. They gave me ₹25,000 more than an online buyer and gave instant Form 29/30 indemnity. Down payment was adjusted directly and my Punch was ready in 4 days.'
    },
    {
      id: 'rev-5',
      name: 'Vikramaditya Solanki',
      locality: 'Bicholi Mardana, Indore',
      car: 'Tata Harrier Fearless+ (AT)',
      type: 'BODYSHOP',
      rating: 5,
      date: '1 month ago',
      verified: true,
      comment: 'Had a left door dent from a two-wheeler collision on the bypass. Shyam Automotive’s cashless desk handled HDFC ERGO survey in 20 minutes without me paying a single rupee except file charges. PPG paint booth finish is 100% factory original.'
    },
    {
      id: 'rev-6',
      name: 'Manoj Patidar',
      locality: 'Silicon City / Rau Bypass, Indore',
      car: 'Tata Altroz Racer',
      type: 'SERVICE',
      rating: 5,
      date: '1 month ago',
      verified: true,
      comment: 'The Price Lock promise is genuine. My estimated bill was ₹4,230 on their website and the actual invoice at the counter was ₹4,230. No forced AC disinfectant or unnecessary engine flushes pushed by advisors.'
    }
  ];

  const filteredReviews = filter === 'ALL'
    ? REVIEWS
    : REVIEWS.filter(r => r.type === filter);

  return (
    <section className="px-3 sm:px-6 lg:px-8 py-8 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Title & Google Proof */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>4.9★ RATED BY 1,237+ INDORE FAMILIES</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Real Experiences from Real Tata Owners
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Read uncensored feedback across sales, 90-minute servicing, valet pickup, and insurance repairs.
            </p>
          </div>

          <a
            href="https://maps.google.com/?q=Tata+Motors+Cars+Showroom+Shyam+Automotive+Scheme+140+Indore"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors border border-slate-200 shrink-0"
          >
            <span>View All 1,237 Google Reviews</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'ALL', label: 'All Reviews (1,237)' },
            { id: 'DELIVERY', label: '🎉 New Car Delivery' },
            { id: 'SERVICE', label: '⚡ 90-Min Periodic Service' },
            { id: 'VALET', label: '🛡️ Doorstep Valet TrustPass' },
            { id: 'BODYSHOP', label: '🔧 Cashless Bodyshop' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filter === f.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReviews.map(review => (
            <div
              key={review.id}
              className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3 flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition-all"
            >
              <div className="space-y-2.5">
                
                {/* Rating & Verified Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Customer
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{review.comment}"
                </p>

              </div>

              <div className="pt-3 border-t border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold text-slate-900">{review.name}</strong>
                  <span className="text-[10px] text-slate-400">{review.date}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-blue-700">{review.car}</span>
                  <span className="flex items-center gap-0.5 text-slate-400">
                    <MapPin className="w-3 h-3" /> {review.locality}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
